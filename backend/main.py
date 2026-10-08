"""Vena CLI Entry Point (main.py).

WHY Typer + Hydra together?
  - Typer gives us a clean, self-documenting CLI with ``--help`` at every level.
  - Hydra handles configuration composition, overrides, and sweep experiments.
  - The two are bridged by the ``hydra_typer_bridge`` pattern: Typer owns the
    CLI surface while Hydra owns the configuration graph.

Usage examples:
    # Train with default config
    python main.py train

    # Override any config value from the CLI (Hydra syntax)
    python main.py train training.learning_rate=5e-4 training.epochs=100

    # Hydra multirun sweep over learning rates
    python main.py train --multirun training.learning_rate=1e-3,5e-4,1e-4
"""

from __future__ import annotations

import logging
from typing import Optional

import hydra
import typer
from omegaconf import DictConfig

# ─── Typer App ────────────────────────────────────────────────────────────────
# One top-level ``app`` follows the Typer recommended pattern; sub-commands
# are registered as nested Typer apps to keep the CLI infinitely extensible.
app = typer.Typer(
    name="vena",
    help="Vena — Stroke Risk Prediction CLI 🧠",
    add_completion=False,  # disable shell-completion injection in dev
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Train Command
# ─────────────────────────────────────────────────────────────────────────────


def _hydra_train(cfg: DictConfig) -> None:
    """Inner function that Hydra wraps; receives the resolved config tree.

    Separated from the Typer command to keep Hydra's decorator isolated —
    stacking ``@hydra.main`` and ``@app.command`` on the same function causes
    argument-parsing conflicts.
    """
    from vena.train import run_training

    logger.info("Starting Vena training run…")
    logger.info("Config:\n%s", cfg)
    run_training(cfg)


@app.command()
def train(
    config_path: str = typer.Option(
        "conf",
        "--config-path",
        "-cp",
        help="Path to the Hydra config directory (relative to main.py).",
    ),
    config_name: str = typer.Option(
        "config",
        "--config-name",
        "-cn",
        help="Name of the config file inside --config-path (without .yaml).",
    ),
    overrides: Optional[list[str]] = typer.Argument(
        default=None,
        help="Hydra override strings, e.g. training.learning_rate=5e-4",
    ),
) -> None:
    """Launch the training pipeline using Hydra configuration.

    All hyperparameters are read from ``conf/config.yaml`` unless overridden
    via positional CLI arguments using Hydra dot-notation syntax.

    Args:
        config_path: Directory containing the Hydra config files.
        config_name: Base name of the primary config file.
        overrides: Optional list of Hydra override strings.
    """
    # WHY compose API instead of @hydra.main here?
    #   The compose API lets us construct the DictConfig programmatically,
    #   giving Typer full control over argument parsing.  @hydra.main would
    #   hijack sys.argv, conflicting with Typer's own parser.
    from hydra import compose, initialize_config_dir
    from hydra.core.global_hydra import GlobalHydra
    import os

    GlobalHydra.instance().clear()

    abs_config_path = os.path.abspath(config_path)
    with initialize_config_dir(config_dir=abs_config_path, version_base=None):
        cfg: DictConfig = compose(
            config_name=config_name,
            overrides=overrides or [],
        )

    _hydra_train(cfg)


# ─────────────────────────────────────────────────────────────────────────────
# Evaluate Command (Phase 2 placeholder)
# ─────────────────────────────────────────────────────────────────────────────


@app.command()
def evaluate(
    checkpoint: str = typer.Argument(..., help="Path to a .pt checkpoint file."),
) -> None:
    """Evaluate a saved model checkpoint on the test set.

    Full implementation in Phase 2 — runs the evaluation loop and prints
    classification metrics (AUROC, precision, recall, F1) to stdout.

    Args:
        checkpoint: Path to the ``.pt`` file produced by the train command.
    """
    typer.echo(f"[Phase 2] Evaluating checkpoint: {checkpoint}")
    raise typer.Exit(code=0)


# ─────────────────────────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    app()
