"""Vena — Training Loop (train.py).

Phase 3 Additions:
  - Integration with MLflow for tracking metrics, hyperparameters, and models.
  - Implemented advanced metrics (AUROC, F1, Precision, Recall) using scikit-learn
    because Accuracy is highly misleading for imbalanced datasets (~5% positive).
  - Added Early Stopping mechanism to prevent overfitting.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import TYPE_CHECKING

import mlflow
import mlflow.pytorch
import torch
import torch.nn as nn
from sklearn.metrics import (  # type: ignore[import]
    accuracy_score,
    average_precision_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from torch.utils.data import DataLoader, TensorDataset

if TYPE_CHECKING:
    from omegaconf import DictConfig

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Device Resolution
# ─────────────────────────────────────────────────────────────────────────────


def resolve_device() -> torch.device:
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
    model.train()
    total_loss = 0.0

    for X_batch, y_batch in loader:
        X_batch = X_batch.to(device)
        y_batch = y_batch.to(device)

        # ── Kutsal Üçlü ──────────────────────────────────────────────────────
        optimizer.zero_grad(set_to_none=True)
        logits = model(X_batch)
        loss = criterion(logits, y_batch)
        loss.backward()
        optimizer.step()
        # ─────────────────────────────────────────────────────────────────────

        total_loss += loss.item()

    return total_loss / len(loader)


def evaluate(
    model: nn.Module,
    loader: DataLoader[TensorDataset],
    criterion: nn.Module,
    device: torch.device,
) -> tuple[float, float, float, float, float, float, float]:
    """Evaluate model and return advanced classification metrics including AUPRC."""
    model.eval()
    total_loss = 0.0

    all_targets: list[float] = []
    all_preds: list[float] = []
    all_probs: list[float] = []

    with torch.no_grad():
        for X_batch, y_batch in loader:
            X_batch = X_batch.to(device)
            y_batch = y_batch.to(device)

            logits = model(X_batch)
            loss = criterion(logits, y_batch)
            total_loss += loss.item()

            # Probabilities and hard predictions
            probs = torch.sigmoid(logits)
            preds = (probs >= 0.5).float()

            all_targets.extend(y_batch.cpu().numpy().tolist())
            all_preds.extend(preds.cpu().numpy().tolist())
            all_probs.extend(probs.cpu().numpy().tolist())

    mean_loss = total_loss / len(loader)

    # Calculate Phase 3 & Imbalanced Benchmark Metrics
    acc = accuracy_score(all_targets, all_preds)
    f1 = f1_score(all_targets, all_preds, zero_division=0)
    prec = precision_score(all_targets, all_preds, zero_division=0)
    rec = recall_score(all_targets, all_preds, zero_division=0)

    try:
        auroc = roc_auc_score(all_targets, all_probs)
    except ValueError:
        auroc = 0.5  # Fallback if only one class is present in the batch

    # AUPRC (Area Under Precision-Recall Curve): Gold standard for 95-5 imbalance
    try:
        auprc = average_precision_score(all_targets, all_probs)
    except ValueError:
        auprc = 0.0

    return mean_loss, acc, f1, prec, rec, auroc, auprc


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
    logger.info("Checkpoint saved → %s", checkpoint_path)
    return checkpoint_path


def run_training(cfg: DictConfig) -> None:
    from vena.data import build_dataloaders, load_raw_data, preprocess, split_and_scale
    from vena.model import DualTowerStrokeTransformer, StrokeMLP

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

    # ── Model Architecture Selection (DualTower vs Baseline MLP) ──────────────
    arch_type = getattr(cfg.model, "architecture", "DualTowerStrokeTransformer")
    logger.info("Selected model architecture: %s", arch_type)

    if arch_type == "DualTowerStrokeTransformer":
        model = DualTowerStrokeTransformer(
            input_dim=X_train.shape[1],
            numerical_indices=[0, 5, 6],  # age, glucose, bmi
            d_model=getattr(cfg.model, "d_model", 64),
            nhead=getattr(cfg.model, "nhead", 4),
            num_layers=getattr(cfg.model, "num_layers", 2),
            d_cat=getattr(cfg.model, "d_cat", 32),
            dropout=getattr(cfg.model, "dropout", 0.15),
            output_dim=cfg.model.output_dim,
        ).to(device)
    else:
        model = StrokeMLP(
            input_dim=X_train.shape[1],
            hidden_layers=list(cfg.model.hidden_layers),
            output_dim=cfg.model.output_dim,
            dropout=cfg.model.dropout,
        ).to(device)

    # ── Imbalance Handling: Positive Class Weighting ──────────────────────────
    # Exact negative-to-positive ratio in train split or config override
    if hasattr(cfg.training, "pos_weight") and cfg.training.pos_weight is not None:
        pos_weight_val = float(cfg.training.pos_weight)
    else:
        pos_weight_val = float((y_train == 0).sum() / max(1, (y_train == 1).sum()))
    logger.info("Using BCEWithLogitsLoss pos_weight=%.2f (compensating class imbalance)", pos_weight_val)

    pos_weight = torch.tensor([pos_weight_val], device=device)
    criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)
    optimizer = torch.optim.Adam(
        model.parameters(),
        lr=cfg.training.learning_rate,
        weight_decay=getattr(cfg.training, "weight_decay", 3e-4)
    )

    # ── MLflow Setup ──────────────────────────────────────────────────────────
    mlflow_db_path = Path(cfg.artefacts.checkpoint_dir).parent.parent / "mlflow.db"
    mlflow.set_tracking_uri(f"sqlite:///{mlflow_db_path.absolute()}")
    mlflow.set_experiment("vena_stroke_prediction")

    # ── Epoch Loop with Early Stopping ────────────────────────────────────────
    best_val_loss = float("inf")
    best_auprc = 0.0
    patience = cfg.training.early_stopping_patience
    patience_counter = 0

    with mlflow.start_run(run_name=f"{arch_type}_Run"):
        mlflow.log_params({
            "architecture": arch_type,
            "learning_rate": cfg.training.learning_rate,
            "batch_size": cfg.training.batch_size,
            "pos_weight": pos_weight_val,
            "epochs": cfg.training.epochs,
            "dropout": cfg.model.dropout,
            "input_dim": X_train.shape[1],
        })

        for epoch in range(1, cfg.training.epochs + 1):
            train_loss = train_one_epoch(model, train_loader, criterion, optimizer, device)
            val_loss, val_acc, val_f1, val_prec, val_rec, val_auroc, val_auprc = evaluate(
                model, test_loader, criterion, device
            )

            # Log metrics per epoch
            mlflow.log_metrics({
                "train_loss": train_loss,
                "val_loss": val_loss,
                "val_accuracy": val_acc,
                "val_f1": val_f1,
                "val_precision": val_prec,
                "val_recall": val_rec,
                "val_auroc": val_auroc,
                "val_auprc": val_auprc,
            }, step=epoch)

            logger.info(
                "Epoch %03d | train_loss=%.4f | val_loss=%.4f | val_auprc=%.4f | val_auroc=%.4f | val_f1=%.4f",
                epoch, train_loss, val_loss, val_auprc, val_auroc, val_f1
            )

            # Checkpoint & Early Stopping logic (optimizing on validation loss)
            if val_loss < best_val_loss:
                best_val_loss = val_loss
                best_auprc = val_auprc
                patience_counter = 0
                save_checkpoint(
                    model=model,
                    epoch=epoch,
                    val_loss=val_loss,
                    checkpoint_dir=cfg.artefacts.checkpoint_dir,
                    filename=cfg.artefacts.best_model_name,
                )

                # Log the best model directly to MLflow with a signature
                mlflow.pytorch.log_model(
                    model,
                    "best_model",
                    input_example=X_train.iloc[:1].to_numpy(dtype="float32")
                )
            else:
                patience_counter += 1
                if patience_counter >= patience:
                    logger.warning("Erken durdurma (Early Stopping) devreye girdi! Epoch: %d", epoch)
                    break

        logger.info("Training complete. Best val_loss=%.4f (val_auprc=%.4f)", best_val_loss, best_auprc)
