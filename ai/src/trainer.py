import json
import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.compose import ColumnTransformer
from sklearn.decomposition import PCA
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error, silhouette_score
from sklearn.neural_network import MLPRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from src.config import (
    ARTIFACTS_DIR,
    CATEGORICAL_FEATURES,
    KMEANS_FEATURES,
    KMEANS_N_CLUSTERS,
    KMEANS_PIPELINE_PATH,
    LINEAR_MODEL_PATH,
    METADATA_PATH,
    NEURAL_MODEL_PATH,
    NUMERICAL_FEATURES,
    PCA_PATH,
    RANDOM_STATE,
    TARGET_COLUMN,
)
from src.data_loader import load_and_clean_dataset, split_features_and_target


def build_preprocessor() -> ColumnTransformer:
    """Escala variables numericas y codifica variables categoricas con One-Hot."""
    return ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
        ]
    )


def evaluate_predictions(y_true: pd.Series, y_pred: np.ndarray) -> dict[str, float]:
    """Calcula MAE, RMSE y R2 sobre predicciones acotadas entre 0 y 100."""
    clipped_pred = np.clip(y_pred, 0.0, 100.0)
    return {
        "mae": round(float(mean_absolute_error(y_true, clipped_pred)), 2),
        "rmse": round(float(root_mean_squared_error(y_true, clipped_pred)), 2),
        "r2": round(float(r2_score(y_true, clipped_pred)), 4),
    }


def train_and_save_all() -> dict:
    """Entrena Regresion Lineal, Red Neuronal Densa y K-Means, y guarda los artefactos."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    df = load_and_clean_dataset()
    X_train, X_test, y_train, y_test = split_features_and_target(df)

    # 1. Prediccion de referencia (baseline): siempre predice el promedio de entrenamiento
    train_mean_score = float(y_train.mean())
    baseline_pred = np.full(shape=len(y_test), fill_value=train_mean_score)
    baseline_metrics = evaluate_predictions(y_test, baseline_pred)

    # 2. Modelo supervisado 1: Regresion Lineal
    linear_pipeline = Pipeline(
        steps=[
            ("preprocessor", build_preprocessor()),
            ("model", LinearRegression()),
        ]
    )
    linear_pipeline.fit(X_train, y_train)
    linear_metrics = evaluate_predictions(y_test, linear_pipeline.predict(X_test))

    # 3. Modelo supervisado 2: Red Neuronal Densa (capas ocultas ReLU + salida lineal)
    neural_pipeline = Pipeline(
        steps=[
            ("preprocessor", build_preprocessor()),
            (
                "model",
                MLPRegressor(
                    hidden_layer_sizes=(64, 32),
                    activation="relu",
                    solver="adam",
                    alpha=0.05,
                    learning_rate_init=0.005,
                    max_iter=1500,
                    random_state=RANDOM_STATE,
                ),
            ),
        ]
    )
    neural_pipeline.fit(X_train, y_train)
    neural_metrics = evaluate_predictions(y_test, neural_pipeline.predict(X_test))

    # Seleccionar automaticamente el modelo con menor error RMSE
    best_model_key = (
        "neural_network"
        if neural_metrics["rmse"] < linear_metrics["rmse"]
        else "linear_regression"
    )

    # 4. Modelo no supervisado: K-Means solo con habitos (sin usar la nota del examen)
    X_habits = df[KMEANS_FEATURES].copy()
    kmeans_pipeline = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "kmeans",
                KMeans(
                    n_clusters=KMEANS_N_CLUSTERS,
                    random_state=RANDOM_STATE,
                    n_init=10,
                ),
            ),
        ]
    )
    cluster_labels = kmeans_pipeline.fit_predict(X_habits)
    scaled_habits = kmeans_pipeline.named_steps["scaler"].transform(X_habits)
    kmeans_silhouette = round(float(silhouette_score(scaled_habits, cluster_labels)), 4)

    # Proyeccion 2D con PCA para dibujar el mapa de grupos en el frontend
    pca = PCA(n_components=2, random_state=RANDOM_STATE)
    coords_2d = pca.fit_transform(scaled_habits)

    # Analizar caracteristicas y nota promedio de cada grupo formado
    df_with_clusters = df.copy()
    df_with_clusters["cluster_id"] = cluster_labels

    clusters_summary = []
    for cid in range(KMEANS_N_CLUSTERS):
        group_df = df_with_clusters[df_with_clusters["cluster_id"] == cid]
        clusters_summary.append(
            {
                "cluster_id": int(cid),
                "label": f"Grupo {cid + 1}",
                "count": int(len(group_df)),
                "avg_exam_score": round(float(group_df[TARGET_COLUMN].mean()), 2),
                "averages": {
                    col: round(float(group_df[col].mean()), 2)
                    for col in KMEANS_FEATURES
                },
            }
        )

    # Muestra de puntos 2D para graficar el mapa de grupos sin sobrecargar el JSON
    sample_size = min(250, len(df))
    rng = np.random.default_rng(RANDOM_STATE)
    sample_indices = rng.choice(len(df), size=sample_size, replace=False)
    cluster_map_points = [
        {
            "x": round(float(coords_2d[i, 0]), 3),
            "y": round(float(coords_2d[i, 1]), 3),
            "cluster_id": int(cluster_labels[i]),
        }
        for i in sample_indices
    ]

    # Promedios generales del dataset para comparaciones en el frontend
    dataset_averages = {
        col: round(float(df[col].mean()), 2) for col in KMEANS_FEATURES
    }
    dataset_averages["exam_score"] = round(float(df[TARGET_COLUMN].mean()), 2)

    metadata = {
        "dataset_rows": int(len(df)),
        "train_rows": int(len(X_train)),
        "test_rows": int(len(X_test)),
        "train_mean_score": round(train_mean_score, 2),
        "best_model": best_model_key,
        "metrics": {
            "baseline": baseline_metrics,
            "linear_regression": linear_metrics,
            "neural_network": neural_metrics,
        },
        "kmeans": {
            "n_clusters": KMEANS_N_CLUSTERS,
            "silhouette_score": kmeans_silhouette,
            "clusters": clusters_summary,
            "map_points": cluster_map_points,
        },
        "dataset_averages": dataset_averages,
    }

    # Guardar modelos y metadatos en ai/artifacts/
    joblib.dump(linear_pipeline, LINEAR_MODEL_PATH)
    joblib.dump(neural_pipeline, NEURAL_MODEL_PATH)
    joblib.dump(kmeans_pipeline, KMEANS_PIPELINE_PATH)
    joblib.dump(pca, PCA_PATH)
    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    return metadata


if __name__ == "__main__":
    info = train_and_save_all()
    print("=== ENTRENAMIENTO COMPLETADO ===")
    print(f"Baseline (promedio {info['train_mean_score']}): {info['metrics']['baseline']}")
    print(f"Regresion Lineal: {info['metrics']['linear_regression']}")
    print(f"Red Neuronal Densa: {info['metrics']['neural_network']}")
    print(f"Mejor modelo (menor RMSE): {info['best_model']}")
    print(f"K-Means ({info['kmeans']['n_clusters']} grupos) | Silhouette: {info['kmeans']['silhouette_score']}")
    for c in info["kmeans"]["clusters"]:
        print(
            f"  - {c['label']}: {c['count']} estudiantes | "
            f"Nota promedio: {c['avg_exam_score']} | "
            f"Estudio: {c['averages']['study_hours_per_day']}h | "
            f"Sueno: {c['averages']['sleep_hours']}h"
        )