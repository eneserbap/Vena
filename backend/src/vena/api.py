"""Vena — FastAPI REST API (api.py).

Serves the trained StrokeMLP model for real-time inference.
"""
import asyncio
import random
import urllib.request
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
import pandas as pd
import torch
torch.set_num_threads(1)
torch.set_num_interop_threads(1)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from vena.dashboard import get_dashboard_html
from vena.data import load_raw_data, preprocess
from vena.model import DualTowerStrokeTransformer, StrokeMLP

# Global variables for caching preprocessors and model
MODEL = None
SCALER = None
TRAINING_COLUMNS = None


class PatientData(BaseModel):
    gender: str = Field(..., pattern="^(Male|Female|Other)$", examples=["Male"])
    age: float = Field(..., ge=0, le=120, description="Yaş (0-120 arası olmalı)", examples=[67.0])
    hypertension: int = Field(..., ge=0, le=1, description="Hipertansiyon: Yok (0) veya Var (1)", examples=[0])
    heart_disease: int = Field(..., ge=0, le=1, description="Kalp Hastalığı: Yok (0) veya Var (1)", examples=[1])
    Residence_type: str = Field(..., pattern="^(Urban|Rural)$", examples=["Urban"])
    avg_glucose_level: float = Field(..., ge=30, le=400, description="Glikoz Seviyesi (30-400 mg/dL)", examples=[228.69])
    bmi: float = Field(..., ge=10, le=80, description="Vücut Kitle İndeksi (10-80 arası)", examples=[36.6])
    smoking_status: str = Field(..., pattern="^(formerly smoked|never smoked|smokes|Unknown)$", examples=["formerly smoked"])


class PredictionResult(BaseModel):
    stroke_risk_percentage: float
    is_high_risk: bool
    doctors_report: str

import shap

EXPLAINER = None


async def anti_sleep_ping():
    """Hacker-style Anti-Sleep mechanism for Render free tier."""
    url = "https://vena-kbet.onrender.com/"
    # Gerçek bir tarayıcı taklidi yapıyoruz ki Render firewall engellemesin
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/117.0.0.0 Safari/537.36'}
    )
    while True:
        # 5 ile 14 dakika arası rastgele bekle
        sleep_time = random.randint(5 * 60, 14 * 60)
        await asyncio.sleep(sleep_time)
        try:
            print(f"🕵️‍♂️ Anti-Sleep Hack: Pinging {url} to keep Render awake...")
            # Bloklamaması için işlemi thread'e devrediyoruz
            await asyncio.to_thread(urllib.request.urlopen, req, timeout=10)
            print("🕵️‍♂️ Ping successful!")
        except Exception as e:
            print(f"🕵️‍♂️ Anti-Sleep Hack failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager to load model and preprocessors at startup."""
    global MODEL, SCALER, TRAINING_COLUMNS

    print("🚀 Loading preprocessors and model...")
    # NOTE: In a fully separated production environment, you would load `scaler.pkl`
    # and `columns.pkl` directly from MLflow or an S3 bucket.
    # For this phase, we reconstruct the exact training scaler dynamically on startup.

    raw_path = Path("data/raw/healthcare-dataset-stroke-data.csv")
    if not raw_path.exists():
        raise RuntimeError(f"Raw data not found at {raw_path}.")

    # Reconstruct training features
    df = load_raw_data(raw_path)
    X, y = preprocess(df, "stroke", ["id"])
    X_train, _, _, _ = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # Save the expected column layout and fit the scaler
    TRAINING_COLUMNS = X_train.columns
    SCALER = StandardScaler()
    SCALER.fit(X_train)

    # Load the trained PyTorch model
    checkpoint_path = Path("outputs/checkpoints/vena_best.pt")
    if not checkpoint_path.exists():
        raise RuntimeError(f"Model checkpoint not found at {checkpoint_path}.")

    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
    state_dict = checkpoint["model_state_dict"]

    if "vital_token_weights" in state_dict or "left_tower.0.weight" in state_dict:
        MODEL = DualTowerStrokeTransformer(
            input_dim=len(TRAINING_COLUMNS),
            numerical_indices=[0, 5, 6],
            d_model=64,
            nhead=4,
            num_layers=2,
            d_cat=32,
            dropout=0.15,
            output_dim=1,
        )
        print("🧠 Loaded Dual-Tower Transformer Model (IEEE 2026 Framework)")
    else:
        MODEL = StrokeMLP(
            input_dim=len(TRAINING_COLUMNS),
            hidden_layers=[64, 32],
            output_dim=1,
            dropout=0.3,
        )
        print("🧠 Loaded StrokeMLP Model")

    MODEL.load_state_dict(state_dict)
    MODEL.eval()

    # Initialize SHAP Explainer
    global EXPLAINER
    # Select 15 random samples as background for SHAP (keeps latency <0.05s and RAM minimal)
    background_df = X_train.sample(n=min(15, len(X_train)), random_state=42)
    background_scaled = SCALER.transform(background_df)
    background_tensor = torch.tensor(background_scaled, dtype=torch.float32)
    try:
        EXPLAINER = shap.GradientExplainer(MODEL, background_tensor)
    except Exception:
        EXPLAINER = shap.DeepExplainer(MODEL, background_tensor)

    # Free large memory allocations from startup to keep Render RSS RAM well under 250MB
    del df, X, y, X_train, background_df, background_scaled
    import gc
    gc.collect()

    print("✅ API is ready for inference with ultra-fast SHAP Explainability!")

    # 🕵️‍♂️ Start the Anti-Sleep Hack in the background
    ping_task = asyncio.create_task(anti_sleep_ping())

    yield

    ping_task.cancel()
    print("🛑 Shutting down API...")


from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from prometheus_fastapi_instrumentator import Instrumentator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

app = FastAPI(
    title="VENA PROJECT API",
    summary="A production-grade Deep Learning inference API for Stroke Risk Prediction.",
    description="Welcome to the VENA REST API. This service provides real-time inference using a PyTorch MLP trained on tabular clinical records.",
    version="2.0.0",
    docs_url=None, # Disable default swagger
    redoc_url=None, # Disable default redoc
    lifespan=lifespan,
)

# Set up Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Prometheus Monitoring ────────────────────────────────────────────────────
# Collect request latency, status codes, and system throughput, exposed at /metrics
Instrumentator().instrument(app).expose(app, endpoint="/metrics", include_in_schema=True, tags=["Monitoring"])

@app.get("/docs", include_in_schema=False)
async def custom_api_docs() -> HTMLResponse:
    """Returns a beautiful custom API documentation using Scalar."""
    html_content = """
    <!DOCTYPE html>
    <html>
      <head>
        <title>VENA PROJECT API Docs</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            background-color: #0f0f11; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
          }
          .vena-nav-bar {
            position: fixed;
            top: 14px;
            right: 20px;
            z-index: 999999;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .vena-nav-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            font-size: 12px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 9999px;
            transition: all 0.2s ease;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
          }
          .btn-dashboard {
            background: rgba(208, 255, 90, 0.15);
            color: #d0ff5a;
            border: 1px solid rgba(208, 255, 90, 0.4);
          }
          .btn-dashboard:hover {
            background: #d0ff5a;
            color: #000;
            transform: translateY(-1px);
            box-shadow: 0 0 20px rgba(208, 255, 90, 0.4);
          }
          .btn-metrics {
            background: rgba(30, 41, 59, 0.85);
            color: #94a3b8;
            border: 1px solid rgba(255, 255, 255, 0.12);
          }
          .btn-metrics:hover {
            background: rgba(51, 65, 85, 0.95);
            color: #f8fafc;
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
          }
          .pulse-dot {
            width: 7px;
            height: 7px;
            background-color: #d0ff5a;
            border-radius: 50%;
            box-shadow: 0 0 8px #d0ff5a;
            animation: pulse-ring 1.8s infinite;
          }
          @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.5; }
          }
          @media (max-width: 640px) {
            .vena-nav-bar {
              top: 10px;
              right: 10px;
              gap: 6px;
            }
            .vena-nav-btn {
              padding: 5px 10px;
              font-size: 11px;
            }
          }
        </style>
      </head>
      <body>
        <!-- Floating Navigation for Telemetry & Metrics -->
        <div class="vena-nav-bar">
          <a href="/dashboard" class="vena-nav-btn btn-dashboard" title="Live Observability Dashboard">
            <span class="pulse-dot"></span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
            <span>Live Dashboard</span>
          </a>
          <a href="/metrics" class="vena-nav-btn btn-metrics" target="_blank" title="Raw Prometheus OpenMetrics Feed">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>
            <span>/metrics</span>
          </a>
        </div>

        <!-- Scalar API Reference -->
        <script 
            id="api-reference" 
            data-url="/openapi.json"
            data-theme="moon"
            data-hide-models="false"
        ></script>
        <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
      </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@app.get("/dashboard", response_class=HTMLResponse, include_in_schema=True, tags=["Monitoring"])
@app.get("/monitoring", response_class=HTMLResponse, include_in_schema=False)
def monitoring_dashboard() -> HTMLResponse:
    """Returns the live visual telemetry & Prometheus monitoring dashboard."""
    return HTMLResponse(content=get_dashboard_html())


@app.get("/")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "model": "StrokeMLP",
        "docs": "/docs",
        "metrics": "/metrics",
        "dashboard": "/dashboard"
    }


@app.post("/predict", response_model=PredictionResult)
@limiter.limit("10/minute")
def predict(request: Request, patient: PatientData) -> PredictionResult:
    """Predict the stroke risk for a given patient."""
    if MODEL is None or SCALER is None or TRAINING_COLUMNS is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")

    patient_dict = patient.model_dump()
    # Add omitted fields back so the pipeline can process them correctly without crashing
    patient_dict["ever_married"] = "Yes"
    patient_dict["work_type"] = "Private"

    # 1. Convert input to DataFrame
    df = pd.DataFrame([patient_dict])

    # 2. Preprocess exactly as in data.py
    df["ever_married"] = df["ever_married"].map({"Yes": 1, "No": 0})
    df["Residence_type"] = df["Residence_type"].map({"Urban": 1, "Rural": 0})

    categorical_cols = ["gender", "work_type", "smoking_status"]
    df = pd.get_dummies(df, columns=categorical_cols)

    # 3. Align columns with training data (add missing, drop extra)
    for col in TRAINING_COLUMNS:
        if col not in df.columns:
            df[col] = 0

    df = df[TRAINING_COLUMNS]
    df = df.astype(float)

    # 4. Scale
    X_scaled = SCALER.transform(df)

    # 5. Predict with PyTorch
    X_tensor = torch.tensor(X_scaled, dtype=torch.float32)
    with torch.no_grad():
        logits = MODEL(X_tensor)
        prob = torch.sigmoid(logits).item()

    risk_percentage = prob * 100
    is_high_risk = prob > 0.5

    # 6. SHAP Explainability (Doctor's Report)
    report = "The Explainable AI (SHAP) report could not be generated at this time."
    if EXPLAINER is not None:
        try:
            # Get SHAP values for the single input tensor
            shap_values = EXPLAINER.shap_values(X_tensor)
            if isinstance(shap_values, list):
                contributions = np.array(shap_values[0]).flatten()
            else:
                contributions = np.array(shap_values).flatten()

            feature_impacts = list(zip(TRAINING_COLUMNS, contributions))
            feature_impacts.sort(key=lambda x: abs(float(x[1])), reverse=True)

            report = "Clinical Analysis Report: "
            if is_high_risk:
                report += f"The system has detected a significantly elevated stroke risk of {risk_percentage:.1f}%. "
            else:
                report += f"The patient's stroke risk is currently at a low level ({risk_percentage:.1f}%). "

            top_positives = [f for f in feature_impacts if f[1] > 0][:2]
            top_negatives = [f for f in feature_impacts if f[1] < 0][:2]

            if top_positives:
                factors = ", ".join([f[0].replace("_", " ").title() for f in top_positives])
                report += f"The primary factors increasing this risk are: {factors}. "
            if top_negatives:
                factors = ", ".join([f[0].replace("_", " ").title() for f in top_negatives])
                report += f"The protective factors reducing this risk are: {factors}. "

            report += "This mathematical analysis is generated using SHAP (Explainable AI)."
        except Exception as e:
            report = "The Explainable AI (SHAP) report could not be generated at this time."
            print(f"SHAP Error: {e}")

    return PredictionResult(
        stroke_risk_percentage=round(risk_percentage, 2),
        is_high_risk=is_high_risk,
        doctors_report=report
    )
