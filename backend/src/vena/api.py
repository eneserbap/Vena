"""Vena — FastAPI REST API (api.py).

Serves the trained StrokeMLP model for real-time inference.
"""
from contextlib import asynccontextmanager
from pathlib import Path

import pandas as pd
import torch
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import asyncio
import urllib.request
import random

from vena.data import load_raw_data, preprocess
from vena.model import StrokeMLP

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
    
    # These match the config.yaml defaults used in Phase 3
    MODEL = StrokeMLP(
        input_dim=len(TRAINING_COLUMNS),
        hidden_layers=[64, 32],
        output_dim=1,
        dropout=0.3
    )
    checkpoint = torch.load(checkpoint_path, map_location="cpu", weights_only=True)
    MODEL.load_state_dict(checkpoint["model_state_dict"])
    MODEL.eval()
    
    # Initialize SHAP Explainer
    global EXPLAINER
    # Select 100 random samples as background for SHAP to baseline against
    background_df = X_train.sample(n=min(100, len(X_train)), random_state=42)
    background_scaled = SCALER.transform(background_df)
    background_tensor = torch.tensor(background_scaled, dtype=torch.float32)
    EXPLAINER = shap.DeepExplainer(MODEL, background_tensor)
    
    print("✅ API is ready for inference with SHAP Explainability!")
    
    # 🕵️‍♂️ Start the Anti-Sleep Hack in the background
    ping_task = asyncio.create_task(anti_sleep_ping())
    
    yield
    
    ping_task.cancel()
    print("🛑 Shutting down API...")


from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

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
          body { margin: 0; padding: 0; background-color: #0f0f11; }
        </style>
      </head>
      <body>
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


@app.get("/")
def health_check() -> dict[str, str]:
    return {"status": "healthy", "model": "StrokeMLP"}


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
    try:
        # Get SHAP values for the single input tensor
        shap_values = EXPLAINER.shap_values(X_tensor)
        # DeepExplainer returns a list of arrays for PyTorch, or single array
        if isinstance(shap_values, list):
            contributions = shap_values[0][0]
        else:
            contributions = shap_values[0]
            
        feature_impacts = list(zip(TRAINING_COLUMNS, contributions))
        feature_impacts.sort(key=lambda x: abs(x[1]), reverse=True)
        
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
