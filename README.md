<div align="center">

<img src="https://img.shields.io/badge/Status-Phase%205%20%E2%80%94%20Full%20Stack-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/PyTorch-2.x-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white" />
<img src="https://img.shields.io/badge/Hydra-1.3-89B4FA?style=for-the-badge" />
<img src="https://img.shields.io/badge/DVC-3.x-945DD6?style=for-the-badge&logo=dvc&logoColor=white" />
<img src="https://img.shields.io/badge/uv-Package%20Manager-DE5FE9?style=for-the-badge" />

<br/><br/>

![Vena Banner](banner.png)

<br/><br/>

# 🧠 Vena
### Stroke Risk Prediction via Tabular Deep Learning

*A production-grade MLOps project built with SOLID principles, reproducible experiments, and CI/CD-ready infrastructure.*

</div>

---

## 📌 Overview

**Vena** is an end-to-end machine learning system that predicts an individual's stroke risk from clinical health data. Given 11 tabular features — including age, BMI, average glucose level, hypertension status, and heart disease history — the model outputs a binary risk score: **stroke (1)** or **no stroke (0)**.

The project is engineered following strict **MLOps best practices**: every hyperparameter is externalised to configuration files, data is version-controlled with DVC, and the entire pipeline is containerised and ready for a CI/CD workflow.

> **Dataset:** [Kaggle — Stroke Prediction Dataset](https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset)  
> 5,110 patient records · 11 clinical features · ~5% positive rate (heavily imbalanced)

---

## ✨ Key Design Principles

| Principle | How It's Applied |
|-----------|-----------------|
| **SOLID** | Each module has one job — `model.py` only defines architecture, `data.py` only handles preprocessing, `train.py` only runs the loop |
| **Zero Hardcoding** | Every hyperparameter (LR, batch size, hidden layers, dropout) lives in `conf/config.yaml` |
| **Reproducibility** | DVC tracks data versions; `uv.lock` pins every dependency; seeds are set in config |
| **Type Safety** | Full PEP 484 type hints across the codebase; enforced by `mypy` in strict mode |
| **Observability** | Structured logging throughout; checkpoint saving with epoch + val_loss metadata |

---

## 🏗️ Architecture

```
vena/
├── conf/
│   └── config.yaml          # Single source of truth for all hyperparameters
│
├── data/
│   ├── raw/                 # Original CSV — tracked by DVC (not Git)
│   └── processed/           # Engineered features — tracked by DVC
│
├── src/vena/
│   ├── model.py             # StrokeMLP: dynamic MLP driven by config
│   ├── data.py              # Load → Preprocess → Split → Scale → DataLoader
│   └── train.py             # Device resolution, training loop, checkpointing
│
├── tests/                   # Pytest unit + integration tests
├── main.py                  # Typer CLI — `vena train`, `vena evaluate`
├── pyproject.toml           # uv deps + ruff + mypy + pytest config
└── train.dockerfile         # Two-layer cached Docker build
```

### Model — `StrokeMLP`

A flexible **Multi-Layer Perceptron** for binary classification.  
Architecture per hidden layer: `Linear → BatchNorm1d → GELU → Dropout`

```python
# Depth and width are entirely config-driven — no code changes needed
StrokeMLP(input_dim=10, hidden_layers=[64, 32], dropout=0.3)
```

- Raw logit output → paired with `BCEWithLogitsLoss` for numerical stability  
- `pos_weight` parameter counteracts the 19:1 class imbalance  
- Dynamic device selection: **CUDA → MPS → CPU**

---

## 🚀 Quick Start

```bash
# 1. Clone & enter project
git clone https://github.com/eneserbap/Vena.git && cd vena

# 2. Install dependencies (uv required)
uv sync

# 3. Pull data via DVC
dvc pull

# 4. Train with default config
python main.py train

# 5. Override any hyperparameter on the fly (Hydra syntax)
python main.py train training.learning_rate=5e-4 model.hidden_layers=[128,64,32]
```

---

## ⚙️ Configuration

All hyperparameters are managed by **Hydra** in `conf/config.yaml`. No values are hardcoded in Python.

```yaml
model:
  hidden_layers: [64, 32]   # Change depth/width without touching Python
  dropout: 0.3

training:
  learning_rate: 1.0e-3
  batch_size: 64
  epochs: 50
  pos_weight: 9.0           # Weights the minority (stroke) class higher

data:
  test_size: 0.2
  random_seed: 42
```

Override anything from the CLI:
```bash
python main.py train training.epochs=200 training.learning_rate=1e-4
```

---

## 🐳 Docker

The Dockerfile uses a **two-layer cache strategy** to prevent re-downloading PyTorch (~800 MB) on every code change:

```dockerfile
# Layer 1 — Dependencies (cached until pyproject.toml changes)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Layer 2 — Source code (invalidated only on code edits)
COPY src/ conf/ main.py ./
```

```bash
docker build -f train.dockerfile -t vena-train:latest .
docker run --gpus all -v $(pwd)/data:/app/data vena-train:latest
```

---

## 🗺️ Roadmap

### ✅ Phase 1 — Scaffolding
- [x] Project structure (Cookiecutter MLOps standard)
- [x] `StrokeMLP` model architecture
- [x] Training loop with the Sacred Triplet (`zero_grad → backward → step`)
- [x] Dynamic device selection (CUDA → MPS → CPU)
- [x] Typer CLI with Hydra configuration bridge
- [x] Two-layer cached Dockerfile
- [x] Ruff + mypy + pytest infrastructure

### ✅ Phase 2 — Data Pipeline
- [x] Implement `data.py`: EDA, median BMI imputation, one-hot encoding, StandardScaler
- [x] DVC remote storage setup (Local fallback due to Azure limits)
- [x] Stratified train/test split (critical for 5% positive rate)
- [x] First end-to-end training run on real data

### ✅ Phase 3 — Metrics & Observability
- [x] Replace accuracy with **AUROC, F1, Precision, Recall** (imbalanced dataset)
- [x] MLflow experiment tracking (metrics, params, artefacts per run)
- [x] Early stopping with configurable patience

### ✅ Phase 4 — CI/CD & Deployment
- [x] REST API inference endpoint (FastAPI)
- [x] Docker containerization for the Backend API
- [x] GitHub Actions pipeline (Automated lint, type-check, and test)
- [x] Cloud Deployment via Render (with Anti-Sleep Hack)

### ✅ Phase 5 — Refinement & Web Interface
- [x] Med-Tech Landing Page (Beautiful UI)
- [x] Responsive Design & Vercel Deployment
- [x] API Security (Rate Limiting with SlowAPI)

### 🔄 Phase 6 — Explainable AI & Human-in-the-Loop (TÜBİTAK Ready) *(Current)*
- [ ] Implement SHAP (SHapley Additive exPlanations) for transparent predictions
- [ ] Generate clinical "Doctor's Report" explaining risk factors mathematically
- [ ] Out-of-Distribution (OOD) Detection: Warn doctors if input data has low confidence/anomalies
- [ ] Doctor Feedback Loop (Active Learning): Allow doctors to flag incorrect predictions for future retraining
- [ ] (Future) Model Monitoring & Data Drift Detection

---

## 🛠️ Tech Stack

| Category | Tool | Why |
|----------|------|-----|
| ML Framework | PyTorch | Dynamic computation graph, MPS support |
| Config Management | Hydra + OmegaConf | CLI overrides, sweeps, zero hardcoding |
| Data Versioning | DVC | Git-like versioning for large data files |
| Package Manager | uv | 10-100× faster than pip, reproducible lock file |
| CLI | Typer | Self-documenting, type-hinted CLI |
| Linting | Ruff | Replaces flake8 + isort in one tool |
| Type Checking | mypy (strict) | Catches dtype/shape errors at dev time |
| Containerisation | Docker | Multi-layer cache, GPU-ready |

---

## 👥 Authors


| **Enes Erbap** 
| **Sudenur Hatkaoglu**

---

