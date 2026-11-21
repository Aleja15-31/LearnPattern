from pathlib import Path

# Rutas principales del modulo de IA
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "student_habits_performance.csv"
ARTIFACTS_DIR = BASE_DIR / "artifacts"

# Rutas donde se guardaran los modelos entrenados y sus metricas
LINEAR_MODEL_PATH = ARTIFACTS_DIR / "linear_regression.joblib"
NEURAL_MODEL_PATH = ARTIFACTS_DIR / "neural_network.joblib"
KMEANS_PIPELINE_PATH = ARTIFACTS_DIR / "kmeans_pipeline.joblib"
PCA_PATH = ARTIFACTS_DIR / "kmeans_pca.joblib"
METADATA_PATH = ARTIFACTS_DIR / "model_metadata.json"

# Columnas del dataset Student Habits vs Academic Performance
ID_COLUMN = "student_id"
TARGET_COLUMN = "exam_score"

NUMERICAL_FEATURES = [
    "age",
    "study_hours_per_day",
    "social_media_hours",
    "netflix_hours",
    "attendance_percentage",
    "sleep_hours",
    "exercise_frequency",
    "mental_health_rating",
]

CATEGORICAL_FEATURES = [
    "gender",
    "part_time_job",
    "diet_quality",
    "parental_education_level",
    "internet_quality",
    "extracurricular_participation",
]

ALL_FEATURES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

# Variables de habitos usadas por K-Means (sin incluir la nota del examen)
KMEANS_FEATURES = [
    "study_hours_per_day",
    "social_media_hours",
    "netflix_hours",
    "attendance_percentage",
    "sleep_hours",
    "exercise_frequency",
    "mental_health_rating",
]

# Parametros base para reproducibilidad y entrenamiento
RANDOM_STATE = 42
TEST_SIZE = 0.2
KMEANS_N_CLUSTERS = 4