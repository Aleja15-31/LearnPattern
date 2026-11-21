
import json
from typing import Any

import joblib
import numpy as np
import pandas as pd

from src.config import (
    ALL_FEATURES,
    KMEANS_FEATURES,
    KMEANS_PIPELINE_PATH,
    LINEAR_MODEL_PATH,
    METADATA_PATH,
    NEURAL_MODEL_PATH,
    PCA_PATH,
)
from src.recommender import generate_recommendations
from src.trainer import train_and_save_all


def _to_scale_5(score_100: float) -> float:
    """Convierte una nota en escala 0-100 a su equivalencia en escala 0-5."""
    return round(score_100 / 20.0, 2)


def _classify_performance(score: float) -> str:
    """Devuelve una etiqueta orientativa segun la nota estimada (0 a 100)."""
    if score >= 85:
        return "Rendimiento estimado alto"
    if score >= 70:
        return "Rendimiento estimado medio-alto"
    if score >= 55:
        return "Rendimiento estimado medio"
    return "Rendimiento estimado bajo"


class LearnPatternPredictor:
    """Carga los modelos entrenados para predecir notas, asignar grupo K-Means y simular cambios."""

    def __init__(self) -> None:
        self._ensure_artifacts_exist()

        self.linear_model = joblib.load(LINEAR_MODEL_PATH)
        self.neural_model = joblib.load(NEURAL_MODEL_PATH)
        self.kmeans_pipeline = joblib.load(KMEANS_PIPELINE_PATH)
        self.pca = joblib.load(PCA_PATH)

        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            self.metadata: dict[str, Any] = json.load(f)

    def _ensure_artifacts_exist(self) -> None:
        """Verifica que existan los modelos entrenados."""
        required_files = [
            LINEAR_MODEL_PATH,
            NEURAL_MODEL_PATH,
            KMEANS_PIPELINE_PATH,
            PCA_PATH,
            METADATA_PATH,
        ]

        if not all(path.exists() for path in required_files):
            train_and_save_all()

    def _predict_scores(self, habits: dict[str, Any]) -> dict[str, float]:
        """Calcula la nota estimada con ambos modelos en escala interna de 0 a 100."""
        row_df = pd.DataFrame([{col: habits[col] for col in ALL_FEATURES}])

        linear_score = float(
            np.clip(self.linear_model.predict(row_df)[0], 0.0, 100.0)
        )
        neural_score = float(
            np.clip(self.neural_model.predict(row_df)[0], 0.0, 100.0)
        )

        best_key = self.metadata["best_model"]
        best_score = (
            linear_score
            if best_key == "linear_regression"
            else neural_score
        )

        return {
            "linear_regression": round(linear_score, 2),
            "neural_network": round(neural_score, 2),
            "best_score": round(best_score, 2),
        }

    def _predict_cluster(self, habits: dict[str, Any]) -> dict[str, Any]:
        """Asigna el grupo K-Means y proyecta los habitos del usuario al plano 2D."""
        habits_df = pd.DataFrame(
            [{col: habits[col] for col in KMEANS_FEATURES}]
        )

        cluster_id = int(self.kmeans_pipeline.predict(habits_df)[0])

        scaled = self.kmeans_pipeline.named_steps["scaler"].transform(
            habits_df
        )
        user_coords = self.pca.transform(scaled)[0]

        cluster_info = next(
            c
            for c in self.metadata["kmeans"]["clusters"]
            if c["cluster_id"] == cluster_id
        )

        return {
            "cluster_id": cluster_id,
            "label": cluster_info["label"],
            "count": cluster_info["count"],
            "avg_exam_score": cluster_info["avg_exam_score"],
            "avg_exam_score_scale_5": _to_scale_5(
                cluster_info["avg_exam_score"]
            ),
            "averages": cluster_info["averages"],
            "user_point": {
                "x": round(float(user_coords[0]), 3),
                "y": round(float(user_coords[1]), 3),
            },
        }

    def predict(self, habits: dict[str, Any]) -> dict[str, Any]:
        """Ejecuta el analisis completo de notas, grupos y recomendaciones."""
        scores = self._predict_scores(habits)
        cluster = self._predict_cluster(habits)

        reference_score = float(self.metadata["train_mean_score"])
        diff_vs_reference = round(
            scores["best_score"] - reference_score, 2
        )

        best_key = self.metadata["best_model"]

        recommendations = generate_recommendations(
            habits=habits,
            group_averages=cluster["averages"],
            dataset_averages=self.metadata["dataset_averages"],
        )

        return {
            "estimated_score": scores["best_score"],
            "estimated_score_scale_5": _to_scale_5(
                scores["best_score"]
            ),
            "performance_level": _classify_performance(
                scores["best_score"]
            ),
            "best_model": best_key,
            "reference_average": reference_score,
            "reference_average_scale_5": _to_scale_5(reference_score),
            "difference_vs_reference": diff_vs_reference,
            "model_comparison": {
                "linear_regression": {
                    "predicted_score": scores["linear_regression"],
                    "predicted_score_scale_5": _to_scale_5(
                        scores["linear_regression"]
                    ),
                    "mae": self.metadata["metrics"]["linear_regression"]["mae"],
                    "rmse": self.metadata["metrics"]["linear_regression"]["rmse"],
                    "r2": self.metadata["metrics"]["linear_regression"]["r2"],
                    "is_selected": best_key == "linear_regression",
                },
                "neural_network": {
                    "predicted_score": scores["neural_network"],
                    "predicted_score_scale_5": _to_scale_5(
                        scores["neural_network"]
                    ),
                    "mae": self.metadata["metrics"]["neural_network"]["mae"],
                    "rmse": self.metadata["metrics"]["neural_network"]["rmse"],
                    "r2": self.metadata["metrics"]["neural_network"]["r2"],
                    "is_selected": best_key == "neural_network",
                },
                "baseline": self.metadata["metrics"]["baseline"],
            },
            "cluster": {
                **cluster,
                "total_clusters": self.metadata["kmeans"]["n_clusters"],
                "map_points": self.metadata["kmeans"]["map_points"],
            },
            "dataset_averages": self.metadata["dataset_averages"],
            "recommendations": recommendations,
            "disclaimer": (
                "Esta estimacion y las recomendaciones son orientativas, "
                "basadas en patrones de datos simulados. "
                "No garantizan una calificacion especifica."
            ),
        }

    def simulate(
        self,
        current_habits: dict[str, Any],
        changes: dict[str, Any],
    ) -> dict[str, Any]:
        """Simula como cambia la nota estimada al modificar los habitos."""
        simulated_habits = {**current_habits, **changes}

        current_scores = self._predict_scores(current_habits)
        simulated_scores = self._predict_scores(simulated_habits)

        current_cluster = self._predict_cluster(current_habits)
        simulated_cluster = self._predict_cluster(simulated_habits)

        score_diff = round(
            simulated_scores["best_score"]
            - current_scores["best_score"],
            2,
        )

        current_5 = _to_scale_5(current_scores["best_score"])
        simulated_5 = _to_scale_5(simulated_scores["best_score"])

        return {
            "current_score": current_scores["best_score"],
            "current_score_scale_5": current_5,
            "simulated_score": simulated_scores["best_score"],
            "simulated_score_scale_5": simulated_5,
            "score_difference": score_diff,
            "score_difference_scale_5": round(
                simulated_5 - current_5, 2
            ),
            "best_model": self.metadata["best_model"],
            "model_comparison": {
                "linear_regression": {
                    "current": current_scores["linear_regression"],
                    "simulated": simulated_scores["linear_regression"],
                    "difference": round(
                        simulated_scores["linear_regression"]
                        - current_scores["linear_regression"],
                        2,
                    ),
                },
                "neural_network": {
                    "current": current_scores["neural_network"],
                    "simulated": simulated_scores["neural_network"],
                    "difference": round(
                        simulated_scores["neural_network"]
                        - current_scores["neural_network"],
                        2,
                    ),
                },
            },
            "current_cluster": current_cluster["label"],
            "simulated_cluster": simulated_cluster["label"],
            "disclaimer": (
                "Esta simulacion refleja patrones aprendidos de datos "
                "simulados y es solo orientativa; cambiar un habito "
                "no garantiza este resultado exacto."
            ),
        }

    def get_model_info(self) -> dict[str, Any]:
        """Retorna las metricas generales, promedios y resumen de grupos."""
        return self.metadata


if __name__ == "__main__":
    predictor = LearnPatternPredictor()

    ejemplo = {
        "age": 20,
        "gender": "Female",
        "study_hours_per_day": 4.5,
        "social_media_hours": 2.5,
        "netflix_hours": 1.5,
        "part_time_job": "No",
        "attendance_percentage": 88.0,
        "sleep_hours": 7.0,
        "diet_quality": "Good",
        "exercise_frequency": 3,
        "parental_education_level": "Bachelor",
        "internet_quality": "Good",
        "mental_health_rating": 7,
        "extracurricular_participation": "Yes",
    }

    # Prueba de prediccion del estudiante
    res = predictor.predict(ejemplo)

    print("=== PRUEBA DE PREDICCION ===")
    print(
        f"Nota estimada ({res['best_model']}): "
        f"{res['estimated_score_scale_5']}/5.0 "
        f"- {res['performance_level']}"
    )

    print(
        f"Grupo K-Means: {res['cluster']['label']} "
        f"| Punto 2D: {res['cluster']['user_point']}"
    )

    print(
        f"Recomendacion principal: "
        f"{res['recommendations'][0]['title']} "
        f"-> {res['recommendations'][0]['priority']}"
    )

    # Prueba de simulacion de cambios en los habitos
    sim = predictor.simulate(
        ejemplo,
        {
            "study_hours_per_day": 6.0,
            "sleep_hours": 8.0,
        },
    )

    print("\n=== PRUEBA DE SIMULACION ===")
    print(
        f"Nota actual: {sim['current_score_scale_5']}/5.0 "
        f"-> Nota simulada: {sim['simulated_score_scale_5']}/5.0"
    )

    print(
        f"Diferencia: +{sim['score_difference_scale_5']}/5.0"
    )
