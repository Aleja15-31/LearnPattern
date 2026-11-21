from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split

from src.config import (
    ALL_FEATURES,
    CATEGORICAL_FEATURES,
    DATA_PATH,
    ID_COLUMN,
    NUMERICAL_FEATURES,
    RANDOM_STATE,
    TARGET_COLUMN,
    TEST_SIZE,
)


def load_and_clean_dataset(path: Path = DATA_PATH) -> pd.DataFrame:
    """Carga el CSV del dataset, valida columnas y limpia valores faltantes."""
    if not path.exists():
        raise FileNotFoundError(
            f"No se encontro el dataset en: {path}. "
            "Verifica que student_habits_performance.csv este en ai/data/."
        )

    df = pd.read_csv(path)

    # Validar que existan todas las columnas esperadas
    expected_columns = set(ALL_FEATURES + [TARGET_COLUMN])
    missing_columns = expected_columns - set(df.columns)
    if missing_columns:
        raise ValueError(
            f"Faltan columnas requeridas en el dataset: {sorted(missing_columns)}"
        )

    # Eliminar columna identificadora si existe y quitar duplicados exactos
    if ID_COLUMN in df.columns:
        df = df.drop(columns=[ID_COLUMN])
    df = df.drop_duplicates().reset_index(drop=True)

    # Limpiar columnas categoricas
    for col in CATEGORICAL_FEATURES:
        if col == "parental_education_level":
            # En este dataset 'None' suele leerse como nulo (NaN)
            df[col] = df[col].fillna("None")
        else:
            mode_value = df[col].mode(dropna=True)[0]
            df[col] = df[col].fillna(mode_value)
        df[col] = df[col].astype(str).str.strip()

    # Limpiar columnas numericas y la variable objetivo
    for col in NUMERICAL_FEATURES + [TARGET_COLUMN]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
        if df[col].isna().any():
            df[col] = df[col].fillna(df[col].median())

    # Asegurar que las notas esten en rango valido de 0 a 100
    df[TARGET_COLUMN] = df[TARGET_COLUMN].clip(0, 100)

    return df


def split_features_and_target(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Separa variables de entrada (X), nota objetivo (y) y divide en train/test."""
    X = df[ALL_FEATURES].copy()
    y = df[TARGET_COLUMN].copy()

    return train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
    )


if __name__ == "__main__":
    dataset = load_and_clean_dataset()
    X_train, X_test, y_train, y_test = split_features_and_target(dataset)

    print(f"Filas cargadas: {len(dataset)}")
    print(f"Nulos restantes: {int(dataset.isna().sum().sum())}")
    print(f"Entrenamiento: {len(X_train)} filas | Prueba: {len(X_test)} filas")
    print(f"Nota promedio del dataset: {dataset[TARGET_COLUMN].mean():.2f}")
    print("\nValores unicos por columna categorica:")
    for col in CATEGORICAL_FEATURES:
        print(f"  - {col}: {sorted(dataset[col].unique().tolist())}")