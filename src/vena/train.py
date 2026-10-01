"""Vena — Training Loop (train.py).

WHY a separate module?
  SRP: this module owns the *training contract* — the optimiser, loss,
  metric collection, and checkpointing.  It does not build the model, load
  data, or parse configuration; those responsibilities live in model.py,
  data.py, and main.py respectively.

  DIP (Dependency Inversion): the public ``train_one_epoch`` and ``evaluate``
  functions accept abstract ``DataLoader`` and ``nn.Module`` interfaces, not
  concrete implementations.  This makes them trivially testable with mock
  objects and swappable models.

The "Kutsal Üçlü" (Sacred Triplet):
  Every gradient-based update follows the exact three-step PyTorch ritual:
    1. ``optimizer.zero_grad()`` — clear stale gradients from the previous step
    2. ``loss.backward()``       — backpropagate the loss through the graph
    3. ``optimizer.step()``      — update parameters via the gradient signal
  Skipping or reordering any step silently corrupts training without errors.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import TYPE_CHECKING

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

if TYPE_CHECKING:
    from omegaconf import DictConfig

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Device Resolution
# ─────────────────────────────────────────────────────────────────────────────


def resolve_device() -> torch.device:
    """Select the best available compute device at runtime.

    Priority order: CUDA → MPS → CPU.

    WHY dynamic resolution?
      The same code runs on a developer's MacBook (MPS), a CI runner (CPU),
      and a cloud GPU VM (CUDA) without any code changes.  The device is
      never hardcoded — it is always derived from the environment.

    Returns:
        The best available ``torch.device``.
    """
    if torch.cuda.is_available():
        device = torch.device("cuda")
    elif torch.backends.mps.is_available():
        device = torch.device("mps")
    else:
        device = torch.device("cpu")

    logger.info("Compute device resolved: %s", device)
    return device


# ─────────────────────────────────────────────────────────────────────────────
# Training & Evaluation
# ─────────────────────────────────────────────────────────────────────────────


def train_one_epoch(
    model: nn.Module,
    loader: DataLoader[TensorDataset],
    criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    device: torch.device,
) -> float:
    """Run one full pass over the training set.

    The Kutsal Üçlü lives here — see module docstring for explanation.

    Args:
        model: The neural network in *training* mode (``model.train()``
            is called internally).
        loader: Mini-batch iterator over the training ``TensorDataset``.
        criterion: Loss function (``BCEWithLogitsLoss`` recommended for
            binary classification with class-imbalance weighting).
        optimizer: Parameter update rule (``Adam`` recommended as starting
            point; can be swapped via config in Phase 2).
        device: Compute device — tensors are moved here before forward pass.

    Returns:
        Mean training loss averaged over all mini-batches in this epoch.
    """
    model.train()
    total_loss = 0.0

    for X_batch, y_batch in loader:
        # Move tensors to device — no-op if already there
        X_batch = X_batch.to(device)
        y_batch = y_batch.to(device)

        # ── Kutsal Üçlü ──────────────────────────────────────────────────────
        # 1. Clear gradients accumulated from the previous mini-batch.
        #    ``set_to_none=True`` is faster than zeroing (avoids memory write).
        optimizer.zero_grad(set_to_none=True)

        # 2. Forward pass → compute logits and loss
        logits = model(X_batch)
        loss = criterion(logits, y_batch)

        # 3. Backward pass → accumulate gradients in .grad attributes
        loss.backward()

        # 4. Parameter update via accumulated gradients
        optimizer.step()
        # ─────────────────────────────────────────────────────────────────────

        total_loss += loss.item()

    return total_loss / len(loader)


def evaluate(
    model: nn.Module,
    loader: DataLoader[TensorDataset],
    criterion: nn.Module,
    device: torch.device,
) -> tuple[float, float]:
    """Evaluate model on a held-out split without updating parameters.

    WHY ``torch.no_grad()``?
      Disables the autograd engine — no computation graph is built, saving
      both memory and compute.  Essential during evaluation/inference.

    Args:
        model: The neural network; switched to ``eval()`` mode internally
            (disables Dropout and uses running BatchNorm statistics).
        loader: Mini-batch iterator over the evaluation ``TensorDataset``.
        criterion: Same loss function used in training for consistency.
        device: Compute device.

    Returns:
        Tuple of ``(mean_loss, accuracy)`` over the full evaluation set.
    """
    model.eval()
    total_loss = 0.0
    correct = 0
    total = 0

    with torch.no_grad():
        for X_batch, y_batch in loader:
            X_batch = X_batch.to(device)
            y_batch = y_batch.to(device)

            logits = model(X_batch)
            loss = criterion(logits, y_batch)
            total_loss += loss.item()

            # Convert raw logit → binary prediction via 0.5 threshold
            preds = (torch.sigmoid(logits) >= 0.5).float()
            correct += (preds == y_batch).sum().item()
            total += y_batch.numel()

    mean_loss = total_loss / len(loader)
    accuracy = correct / total
    return mean_loss, accuracy


# ─────────────────────────────────────────────────────────────────────────────
# Checkpointing
# ─────────────────────────────────────────────────────────────────────────────


def save_checkpoint(
    model: nn.Module,
    epoch: int,
    val_loss: float,
    checkpoint_dir: str | Path,
    filename: str,
) -> Path:
    """Persist model weights to disk as a ``.pt`` checkpoint.

    WHY ``state_dict`` instead of pickling the whole model?
      ``state_dict`` is version-stable: it survives code refactors as long as
      layer names remain consistent.  Pickling the model object couples the
      checkpoint to the Python class definition, making future loading brittle.

    Args:
        model: Trained ``nn.Module`` whose weights we want to persist.
        epoch: Current epoch number, stored in the checkpoint for traceability.
        val_loss: Validation loss at checkpoint time (useful for resuming).
        checkpoint_dir: Directory where the ``.pt`` file will be written.
        filename: Name of the checkpoint file (e.g., ``"vena_best.pt"``).

    Returns:
        Absolute path to the written checkpoint file.
    """
    save_dir = Path(checkpoint_dir)
    save_dir.mkdir(parents=True, exist_ok=True)

    checkpoint_path = save_dir / filename
    torch.save(
        {
            "epoch": epoch,
            "val_loss": val_loss,
            "model_state_dict": model.state_dict(),
        },
        checkpoint_path,
    )
    logger.info("Checkpoint saved → %s  (epoch=%d, val_loss=%.4f)", checkpoint_path, epoch, val_loss)
    return checkpoint_path


def run_training(cfg: "DictConfig") -> None:
    """Orchestrate the full training pipeline from a Hydra config.

    This function is the *composition root* for training: it wires together
    data loading, model instantiation, loss / optimiser construction, the
    epoch loop, and checkpointing.  All hyperparameters come from ``cfg``.

    Args:
        cfg: Hydra ``DictConfig`` object resolved from ``conf/config.yaml``
            (plus any CLI overrides).  Contains sub-keys:
            ``data``, ``model``, ``training``, ``artefacts``.
    """
    from vena.data import build_dataloaders, load_raw_data, preprocess, split_and_scale
    from vena.model import StrokeMLP

    device = resolve_device()

    # ── Data Pipeline ─────────────────────────────────────────────────────────
    df = load_raw_data(cfg.data.raw_path)
    X, y = preprocess(df, cfg.data.target_column, list(cfg.data.drop_columns))
    X_train, X_test, y_train, y_test = split_and_scale(
        X, y, cfg.data.test_size, cfg.data.random_seed
    )
    train_loader, test_loader = build_dataloaders(
        X_train, X_test, y_train, y_test, cfg.training.batch_size
    )

    # ── Model ─────────────────────────────────────────────────────────────────
    # We dynamically read input_dim from the preprocessed data shape (X_train)
    # instead of hardcoding it in the config, to prevent dimension mismatch errors.
    model = StrokeMLP(
        input_dim=X_train.shape[1],
        hidden_layers=list(cfg.model.hidden_layers),
        output_dim=cfg.model.output_dim,
        dropout=cfg.model.dropout,
    ).to(device)

    # ── Loss — weighted for class imbalance ───────────────────────────────────
    # WHY BCEWithLogitsLoss?
    #   Numerically more stable than BCE(sigmoid(logit)) because it uses the
    #   log-sum-exp trick internally.  ``pos_weight`` penalises missing positive
    #   (stroke) examples more heavily to combat the ≈5 % positive rate.
    pos_weight = torch.tensor([cfg.training.pos_weight], device=device)
    criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)

    optimizer = torch.optim.Adam(model.parameters(), lr=cfg.training.learning_rate)

    # ── Epoch Loop ────────────────────────────────────────────────────────────
    best_val_loss = float("inf")

    for epoch in range(1, cfg.training.epochs + 1):
        train_loss = train_one_epoch(model, train_loader, criterion, optimizer, device)
        val_loss, val_acc = evaluate(model, test_loader, criterion, device)

        logger.info(
            "Epoch %03d | train_loss=%.4f | val_loss=%.4f | val_acc=%.4f",
            epoch, train_loss, val_loss, val_acc,
        )

        # ── Best-model checkpointing ───────────────────────────────────────────
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            save_checkpoint(
                model=model,
                epoch=epoch,
                val_loss=val_loss,
                checkpoint_dir=cfg.artefacts.checkpoint_dir,
                filename=cfg.artefacts.best_model_name,
            )

    logger.info("Training complete. Best val_loss=%.4f", best_val_loss)
