"""Vena — Model Architecture (model.py).

WHY a separate module?
  Single Responsibility Principle (SRP): this file owns *only* the neural
  network topology.  It has zero awareness of data loading, training loops,
  or configuration management.  That separation lets us swap model architectures
  in Phase 2 (e.g., TabNet, ResNet-tabular) without touching train.py at all.

Design decisions:
  - ``StrokeMLP`` accepts ``hidden_layers`` as a runtime list so the architecture
    is fully driven by ``conf/config.yaml`` — no hardcoded layer counts.
  - Batch Normalisation before each activation stabilises training on the
    heavily imbalanced stroke dataset (≈5 % positive rate).
  - Dropout rate is externalised to config; default=0.3 is a sensible prior for
    small clinical datasets.
  - The output layer emits a *raw logit* (no sigmoid).  We pair this with
    ``torch.nn.BCEWithLogitsLoss`` in train.py for numerical stability.
"""

from __future__ import annotations

from typing import Sequence

import torch
import torch.nn as nn


class StrokeMLP(nn.Module):
    """Multi-Layer Perceptron for binary stroke-risk classification.

    Architecture per hidden layer:
        Linear → BatchNorm1d → GELU → Dropout

    The output is a single raw logit (no sigmoid); use
    ``BCEWithLogitsLoss`` during training for numerical stability and
    ``torch.sigmoid`` at inference time to obtain a probability.

    Args:
        input_dim: Number of input features after preprocessing.
        hidden_layers: Ordered sequence of neuron counts per hidden layer.
            Driven by ``conf/config.yaml:model.hidden_layers``.
        output_dim: Number of output neurons (1 for binary classification).
        dropout: Probability of zeroing each neuron during training.
            Acts as a regulariser to combat the class-imbalance overfitting.

    Example:
        >>> model = StrokeMLP(input_dim=10, hidden_layers=[64, 32])
        >>> x = torch.randn(8, 10)   # batch of 8 samples
        >>> logits = model(x)        # shape: (8, 1)
    """

    def __init__(
        self,
        input_dim: int,
        hidden_layers: Sequence[int],
        output_dim: int = 1,
        dropout: float = 0.3,
    ) -> None:
        super().__init__()

        # ── Build hidden blocks dynamically from config ────────────────────────
        # WHY loop instead of hardcoded layers?
        #   Hydra sweep can then vary depth/width without code changes.
        layers: list[nn.Module] = []
        in_features = input_dim

        for out_features in hidden_layers:
            layers.extend([
                nn.Linear(in_features, out_features),
                # BatchNorm before activation: stabilises gradient flow on
                # imbalanced tabular data with very different feature scales.
                nn.BatchNorm1d(out_features),
                # GELU chosen over ReLU: smoother gradient around zero,
                # empirically performs better on small clinical tabular datasets.
                nn.GELU(),
                nn.Dropout(p=dropout),
            ])
            in_features = out_features

        # Final projection to output_dim — no activation (raw logit)
        layers.append(nn.Linear(in_features, output_dim))

        # nn.Sequential keeps the forward pass a one-liner and makes the
        # model's structure visible in repr() / torchinfo summaries.
        self.network = nn.Sequential(*layers)

        # ── Weight initialisation ──────────────────────────────────────────────
        # Kaiming (He) init is optimal for GELU / ReLU activations.
        self._init_weights()

    def _init_weights(self) -> None:
        """Apply Kaiming uniform initialisation to all Linear layers.

        WHY explicit init?
        PyTorch's default (Kaiming uniform) is already reasonable, but being
        explicit documents the intention and makes it trivial to swap to
        Xavier init for a sigmoid-activated variant later.
        """
        for module in self.modules():
            if isinstance(module, nn.Linear):
                nn.init.kaiming_uniform_(module.weight, nonlinearity="relu")
                if module.bias is not None:
                    nn.init.zeros_(module.bias)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """Run a forward pass through the MLP.

        Args:
            x: Float tensor of shape ``(batch_size, input_dim)``.

        Returns:
            Raw logit tensor of shape ``(batch_size, output_dim)``.
            Apply ``torch.sigmoid`` to convert to probability at inference.
        """
        return self.network(x)  # type: ignore[no-any-return]
