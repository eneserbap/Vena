"""Vena — Data Loading & Preprocessing (data.py).

WHY a separate module?
  SRP: this module is the *only* place that knows about CSV schemas, feature
  engineering, and train/test splitting.  ``train.py`` and ``model.py`` are
  completely agnostic to where data comes from or how it is shaped.

  OCP: Adding a new data source (e.g., a Parquet warehouse) means adding a new
  loader function, not modifying the existing ``load_raw_data`` path.

Expected CSV schema (Kaggle Stroke Prediction Dataset):
  id, gender, age, hypertension, heart_disease, ever_married,
  work_type, Residence_type, avg_glucose_level, bmi, smoking_status, stroke
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import torch
from sklearn.model_selection import train_test_split  # type: ignore[import]
from sklearn.preprocessing import StandardScaler      # type: ignore[import]
from torch.utils.data import DataLoader, TensorDataset


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────


def load_raw_data(csv_path: str | Path) -> pd.DataFrame:
    """Load the raw stroke CSV into a DataFrame — no transformations.

    Keeping loading separate from preprocessing follows the
    *Single Responsibility* principle: this function has exactly one reason
    to change (the file format or source location).

    Args:
        csv_path: Absolute or relative path to the raw CSV file.
            Typically ``conf/config.yaml:data.raw_path``.

    Returns:
        DataFrame with original column names and dtypes unchanged.

    Raises:
        FileNotFoundError: If ``csv_path`` does not exist.
        pd.errors.ParserError: If the file is malformed.
    """
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"Veri seti bulunamadı: {path}")
    
    return pd.read_csv(path)


def preprocess(
    df: pd.DataFrame,
    target_column: str,
    drop_columns: list[str],
) -> tuple[pd.DataFrame, pd.Series]:
    """Clean, encode, and impute the raw DataFrame.

    Responsibilities:
      1. Drop non-informative columns (e.g., ``id``).
      2. Impute missing ``bmi`` values with median (robust to outliers).
      3. One-hot encode nominal categoricals (``gender``, ``work_type``, etc.).
      4. Ordinal-encode binary categoricals (``ever_married``, ``Residence_type``).

    WHY median imputation for BMI?
      The stroke dataset has ~4 % missing BMI values.  Median is robust to the
      right-skewed BMI distribution and avoids leaking test-set statistics.

    Args:
        df: Raw DataFrame from ``load_raw_data``.
        target_column: Name of the binary label column (``"stroke"``).
        drop_columns: Columns to drop before feature extraction.

    Returns:
        A tuple of ``(X, y)`` where ``X`` is the feature DataFrame and
        ``y`` is the binary label Series (dtype int64).
    """
    df = df.copy()

    # 1. Drop columns
    df = df.drop(columns=drop_columns, errors="ignore")

    # 2. Impute missing BMI
    if "bmi" in df.columns:
        df["bmi"] = df["bmi"].fillna(df["bmi"].median())

    # 3 & 4. Encoding
    # Binary variables
    if "ever_married" in df.columns:
        df["ever_married"] = df["ever_married"].map({"Yes": 1, "No": 0})
    if "Residence_type" in df.columns:
        df["Residence_type"] = df["Residence_type"].map({"Urban": 1, "Rural": 0})

    # Nominal variables -> One-Hot Encoding
    categorical_cols = ["gender", "work_type", "smoking_status"]
    existing_cat_cols = [c for c in categorical_cols if c in df.columns]
    
    df = pd.get_dummies(df, columns=existing_cat_cols, drop_first=False)

    # Separate features and target
    y = df[target_column]
    X = df.drop(columns=[target_column])

    # Ensure all columns are numeric
    X = X.astype(float)
    y = y.astype(int)

    return X, y


def split_and_scale(
    X: pd.DataFrame,
    y: pd.Series,
    test_size: float,
    random_seed: int,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Stratified train/test split with ``StandardScaler`` on features.

    WHY stratified split?
      The stroke label is heavily imbalanced (≈5 % positive).  Random splitting
      risks producing a test set with zero positive examples.  Stratification
      preserves the original class ratio in both subsets.

    WHY scale *after* split?
      Fitting the scaler on the full dataset leaks test-set statistics into the
      training process — a subtle but critical form of data leakage.

    Args:
        X: Feature DataFrame from ``preprocess``.
        y: Binary label Series from ``preprocess``.
        test_size: Fraction of data reserved for testing (e.g., ``0.2``).
        random_seed: Seed for reproducible splits.

    Returns:
        Tuple of ``(X_train, X_test, y_train, y_test)`` as DataFrames/Series
        with features scaled by the *training-set* scaler.
    """
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_seed, stratify=y
    )

    scaler = StandardScaler()
    
    # Scale only based on training data to avoid data leakage
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train), 
        columns=X_train.columns, 
        index=X_train.index
    )
    
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test), 
        columns=X_test.columns, 
        index=X_test.index
    )

    return X_train_scaled, X_test_scaled, y_train, y_test


def build_dataloaders(
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: pd.Series,
    y_test: pd.Series,
    batch_size: int,
) -> tuple[DataLoader[TensorDataset], DataLoader[TensorDataset]]:
    """Convert NumPy arrays to PyTorch ``TensorDataset`` and wrap in ``DataLoader``.

    WHY ``float32`` tensors?
      PyTorch's default float is ``float32``.  Explicit casting prevents silent
      dtype mismatches when the model's Linear layers emit ``float32`` logits.

    Args:
        X_train: Scaled training features.
        X_test: Scaled test features.
        y_train: Training labels.
        y_test: Test labels.
        batch_size: Mini-batch size from ``conf/config.yaml:training.batch_size``.

    Returns:
        Tuple of ``(train_loader, test_loader)``.  The test loader uses
        ``shuffle=False`` to ensure deterministic evaluation metrics.
    """
    # Convert to PyTorch tensors
    X_train_t = torch.tensor(X_train.values, dtype=torch.float32)
    y_train_t = torch.tensor(y_train.values, dtype=torch.float32).unsqueeze(1)
    
    X_test_t = torch.tensor(X_test.values, dtype=torch.float32)
    y_test_t = torch.tensor(y_test.values, dtype=torch.float32).unsqueeze(1)

    # Create Datasets
    train_dataset = TensorDataset(X_train_t, y_train_t)
    test_dataset = TensorDataset(X_test_t, y_test_t)

    # Create DataLoaders
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    return train_loader, test_loader
