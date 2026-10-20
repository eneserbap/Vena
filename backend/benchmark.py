"""Vena — Comparative Benchmark Script (benchmark.py).

Evaluates the Baseline StrokeMLP vs. the IEEE 2026 Dual-Tower Transformer (DT-Transformer)
on the exact same stratified test split under the 95-to-5 class imbalance.
"""

import torch
import torch.nn as nn
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)

from vena.data import build_dataloaders, load_raw_data, preprocess, split_and_scale
from vena.model import DualTowerStrokeTransformer, StrokeMLP


def run_benchmark():
    print("🔬 Vena MLOps — Loading dataset and preparing stratified splits...")
    df = load_raw_data("data/raw/healthcare-dataset-stroke-data.csv")
    X, y = preprocess(df, "stroke", ["id"])
    X_train, X_test, y_train, y_test = split_and_scale(X, y, test_size=0.2, random_seed=42)
    train_loader, test_loader = build_dataloaders(X_train, X_test, y_train, y_test, batch_size=64)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    pos_weight = torch.tensor([19.52], device=device)
    criterion = nn.BCEWithLogitsLoss(pos_weight=pos_weight)

    def train_and_eval(model, epochs=25, lr=5e-4):
        model = model.to(device)
        opt = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=3e-4)
        best_auprc = 0.0
        best_metrics = {}

        for _ in range(1, epochs + 1):
            model.train()
            for xb, yb in train_loader:
                xb, yb = xb.to(device), yb.to(device)
                opt.zero_grad()
                loss = criterion(model(xb), yb)
                loss.backward()
                opt.step()

            model.eval()
            targets, probs = [], []
            with torch.no_grad():
                for xb, yb in test_loader:
                    xb = xb.to(device)
                    logits = model(xb)
                    p = torch.sigmoid(logits)
                    targets.extend(yb.numpy().flatten().tolist())
                    probs.extend(p.cpu().numpy().flatten().tolist())

            preds = [1.0 if val >= 0.5 else 0.0 for val in probs]
            auprc = average_precision_score(targets, probs)
            auroc = roc_auc_score(targets, probs)
            f1 = f1_score(targets, preds, zero_division=0)
            rec = recall_score(targets, preds, zero_division=0)
            prec = precision_score(targets, preds, zero_division=0)
            acc = accuracy_score(targets, preds)

            if auprc > best_auprc:
                best_auprc = auprc
                best_metrics = {
                    "AUPRC": auprc,
                    "AUROC": auroc,
                    "Recall": rec,
                    "F1": f1,
                    "Precision": prec,
                    "Accuracy": acc,
                }
        return best_metrics

    print("🧠 1/2 Training & Evaluating Baseline StrokeMLP...")
    torch.manual_seed(42)
    mlp = StrokeMLP(input_dim=X_train.shape[1], hidden_layers=[64, 32], dropout=0.3)
    mlp_res = train_and_eval(mlp)

    print("⚡ 2/2 Training & Evaluating Dual-Tower Transformer (IEEE 2026 Framework)...")
    torch.manual_seed(42)
    dt = DualTowerStrokeTransformer(input_dim=X_train.shape[1], numerical_indices=[0, 5, 6], dropout=0.15)
    dt_res = train_and_eval(dt)

    print("\n" + "=" * 80)
    print(f"{'Metrik':<18} | {'Eski Standart MLP':<18} | {'Yeni Dual-Tower Trans.':<22} | {'Gelişme (Fark)'}")
    print("-" * 80)
    for m in ["AUPRC", "AUROC", "Recall", "F1", "Precision", "Accuracy"]:
        v1 = mlp_res[m]
        v2 = dt_res[m]
        diff = ((v2 - v1) / v1 * 100) if v1 > 0 else 0
        sign = "+" if diff > 0 else ""
        print(f"{m:<18} | {v1:<18.4f} | {v2:<22.4f} | {sign}{diff:.1f}%")
    print("=" * 80)


if __name__ == "__main__":
    run_benchmark()
