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
    gender: str = Field(..., pattern="^(Male|Female|Other)$", example="Male")
    age: float = Field(..., ge=0, le=120, description="Yaş (0-120 arası olmalı)", example=67.0)
    hypertension: int = Field(..., ge=0, le=1, description="Hipertansiyon: Yok (0) veya Var (1)", example=0)
    heart_disease: int = Field(..., ge=0, le=1, description="Kalp Hastalığı: Yok (0) veya Var (1)", example=1)
    ever_married: str = Field(..., pattern="^(Yes|No)$", example="Yes")
    work_type: str = Field(..., pattern="^(Private|Self-employed|children|Govt_job|Never_worked)$", example="Private")
    Residence_type: str = Field(..., pattern="^(Urban|Rural)$", example="Urban")
    avg_glucose_level: float = Field(..., ge=30, le=400, description="Glikoz Seviyesi (30-400 mg/dL)", example=228.69)
    bmi: float = Field(..., ge=10, le=80, description="Vücut Kitle İndeksi (10-80 arası)", example=36.6)
    smoking_status: str = Field(..., pattern="^(formerly smoked|never smoked|smokes|Unknown)$", example="formerly smoked")


class PredictionResult(BaseModel):
    stroke_risk_percentage: float
    is_high_risk: bool


async def anti_sleep_ping():
    """Hacker-style Anti-Sleep mechanism for Render free tier."""
    url = "https://vena-kbet.onrender.com/"
    while True:
        # 5 ile 14 dakika arası rastgele bekle
        sleep_time = random.randint(5 * 60, 14 * 60)
        await asyncio.sleep(sleep_time)
        try:
            print(f"🕵️‍♂️ Anti-Sleep Hack: Pinging {url} to keep Render awake...")
            urllib.request.urlopen(url)
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
    
    print("✅ API is ready for inference!")
    
    # 🕵️‍♂️ Start the Anti-Sleep Hack in the background
    ping_task = asyncio.create_task(anti_sleep_ping())
    
    yield
    
    ping_task.cancel()
    print("🛑 Shutting down API...")


app = FastAPI(
    title="Vena Stroke Prediction API",
    description="Real-time inference endpoint for StrokeMLP.",
    version="1.0.0",
    lifespan=lifespan,
)


@app.get("/")
def health_check():
    return {"status": "healthy", "model": "StrokeMLP"}


@app.post("/predict", response_model=PredictionResult)
def predict(patient: PatientData):
    """Predict the stroke risk for a given patient."""
    if MODEL is None or SCALER is None or TRAINING_COLUMNS is None:
        raise HTTPException(status_code=503, detail="Model is not loaded.")
        
    # 1. Convert input to DataFrame
    df = pd.DataFrame([patient.model_dump()])
    
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
    # A 15% threshold is often used for imbalanced datasets, but 50% is standard.
    # We'll use 50% for standard classification logic.
    is_high_risk = prob > 0.5 
    
    return PredictionResult(
        stroke_risk_percentage=round(risk_percentage, 2),
        is_high_risk=is_high_risk
    )
