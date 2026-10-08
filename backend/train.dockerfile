# =============================================================================
# train.dockerfile — Vena Stroke Risk Prediction Training Image
#
# Build strategy: TWO explicit cache layers to maximise Docker build speed.
#
#   Layer 1 — Dependencies  (slow, changes rarely):
#     COPY pyproject.toml + uv.lock → uv sync
#     This layer is cached as long as dependencies don't change, so a simple
#     code edit won't re-download PyTorch (≈ 800 MB).
#
#   Layer 2 — Source code  (fast, changes frequently):
#     COPY src/ conf/ main.py
#     A code change invalidates only this layer; the dep layer stays cached.
#
# Usage:
#   docker build -f train.dockerfile -t vena-train:latest .
#   docker run --gpus all -v $(pwd)/data:/app/data vena-train:latest
# =============================================================================

# ── Base image ────────────────────────────────────────────────────────────────
# WHY python:3.11-slim over full python:3.11?
#   Shaves ~700 MB from the image. We install only what we need explicitly.
#   -slim ships with a minimal Debian userland, enough for uv and our deps.
FROM python:3.11-slim AS base

# ── System dependencies ───────────────────────────────────────────────────────
# curl: needed to bootstrap uv installer
# git:  DVC uses git under the hood; required at runtime for dvc pull/push
# ca-certificates: required for HTTPS calls to DVC remotes (S3, GCS, Azure)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        ca-certificates \
    # Clean apt cache to shrink the layer (best practice for production images)
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ── Install uv ────────────────────────────────────────────────────────────────
# WHY uv instead of pip?
#   uv resolves and installs dependencies 10-100× faster than pip, and its
#   lock file guarantees byte-identical environments across machines.
ENV UV_VERSION=0.4.18
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:/root/.local/bin:${PATH}"

# ── Working directory ─────────────────────────────────────────────────────────
WORKDIR /app

# =============================================================================
# LAYER 1 — Dependency installation (cached until pyproject.toml changes)
# =============================================================================
# WHY copy ONLY the manifest files first?
#   Docker cache is invalidated when a COPY source changes. By copying only
#   pyproject.toml and uv.lock before the source code, `uv sync` is skipped
#   on rebuilds triggered by source-code changes — saving minutes per iteration.
COPY pyproject.toml uv.lock* ./

RUN uv sync --frozen --no-dev \
    # Remove uv cache to shrink image; deps are already in the venv
    && uv cache clean

# =============================================================================
# LAYER 2 — Source code (invalidated on any code/config change)
# =============================================================================
# Kept deliberately separate from Layer 1 so that editing model.py, train.py,
# or conf/config.yaml does not trigger a multi-GB dependency reinstall.
COPY src/ ./src/
COPY conf/ ./conf/
COPY main.py ./

# ── Runtime environment ───────────────────────────────────────────────────────
# Tell uv / Python to use the project's virtual environment
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="${VIRTUAL_ENV}/bin:${PATH}"
# Prevent Python from writing .pyc files to the image (keeps layers clean)
ENV PYTHONDONTWRITEBYTECODE=1
# Disable output buffering so logs appear in real-time in Docker / Kubernetes
ENV PYTHONUNBUFFERED=1

# ── Entrypoint ────────────────────────────────────────────────────────────────
# WHY ENTRYPOINT + CMD?
#   ENTRYPOINT fixes the executable (the CLI); CMD provides overrideable
#   defaults. Operators can override CMD at `docker run` time without
#   specifying the full command, e.g.:
#     docker run vena-train:latest evaluate outputs/checkpoints/vena_best.pt
ENTRYPOINT ["python", "main.py"]
CMD ["train"]
