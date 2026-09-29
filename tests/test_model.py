"""Phase 1 smoke test — verifies StrokeMLP can be instantiated and run a forward pass.

WHY test this first?
  Model construction is the only fully-implemented component in Phase 1.
  A smoke test catches import errors, shape mismatches, and device-placement
  bugs immediately — before we have real data.
"""

from __future__ import annotations

import torch
import pytest

from vena.model import StrokeMLP


class TestStrokeMLP:
    """Unit tests for the StrokeMLP architecture."""

    def test_output_shape_matches_batch(self) -> None:
        """Output tensor should be (batch_size, output_dim)."""
        model = StrokeMLP(input_dim=10, hidden_layers=[64, 32], output_dim=1)
        x = torch.randn(16, 10)
        out = model(x)
        assert out.shape == (16, 1), f"Expected (16, 1), got {out.shape}"

    def test_forward_is_deterministic_in_eval_mode(self) -> None:
        """Same input should produce identical output when dropout is disabled."""
        model = StrokeMLP(input_dim=10, hidden_layers=[32], dropout=0.5)
        model.eval()
        x = torch.randn(4, 10)
        with torch.no_grad():
            out1 = model(x)
            out2 = model(x)
        assert torch.allclose(out1, out2), "Eval mode forward is not deterministic"

    def test_output_is_raw_logit_not_probability(self) -> None:
        """Model should return unbounded logits, not [0, 1] probabilities."""
        model = StrokeMLP(input_dim=10, hidden_layers=[64, 32])
        model.eval()
        x = torch.randn(100, 10)
        with torch.no_grad():
            out = model(x)
        # If logits are raw, some should fall outside [0, 1]
        assert not (out.min() >= 0 and out.max() <= 1), (
            "Output looks like probabilities; expected raw logits"
        )

    def test_dynamic_hidden_layers(self) -> None:
        """StrokeMLP must support arbitrary depth from config."""
        for hidden in [[128], [64, 32], [256, 128, 64, 32]]:
            model = StrokeMLP(input_dim=10, hidden_layers=hidden)
            x = torch.randn(8, 10)
            out = model(x)
            assert out.shape == (8, 1)

    def test_single_sample_batchnorm_raises_or_handles(self) -> None:
        """BatchNorm1d requires >1 sample in training mode; eval mode is safe."""
        model = StrokeMLP(input_dim=10, hidden_layers=[32])
        model.eval()
        x = torch.randn(1, 10)
        with torch.no_grad():
            out = model(x)
        assert out.shape == (1, 1)
