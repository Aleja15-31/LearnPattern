from src.config import ALL_FEATURES, KMEANS_N_CLUSTERS, TARGET_COLUMN
from src.data_loader import load_and_clean_dataset, split_features_and_target
from src.predictor import LearnPatternPredictor, _classify_performance, _to_scale_5


def test_dataset_loads_without_nulls_and_valid_ranges():
    df = load_and_clean_dataset()
    assert len(df) == 1000
    assert int(df.isna().sum().sum()) == 0
    for col in ALL_FEATURES + [TARGET_COLUMN]:
        assert col in df.columns
    assert float(df[TARGET_COLUMN].min()) >= 0.0
    assert float(df[TARGET_COLUMN].max()) <= 100.0


def test_train_test_split_ratio():
    df = load_and_clean_dataset()
    X_train, X_test, y_train, y_test = split_features_and_target(df)
    assert len(X_train) == 800
    assert len(X_test) == 200
    assert len(y_train) == 800
    assert len(y_test) == 200


def test_models_metrics_are_valid_and_beat_baseline():
    predictor = LearnPatternPredictor()
    metrics = predictor.get_model_info()["metrics"]

    assert metrics["linear_regression"]["mae"] < metrics["baseline"]["mae"]
    assert metrics["linear_regression"]["rmse"] < metrics["baseline"]["rmse"]
    assert metrics["linear_regression"]["r2"] > 0.80

    assert metrics["neural_network"]["mae"] < metrics["baseline"]["mae"]
    assert metrics["neural_network"]["rmse"] < metrics["baseline"]["rmse"]
    assert metrics["neural_network"]["r2"] > 0.80


def test_kmeans_clusters_have_descriptions_and_sum_dataset():
    predictor = LearnPatternPredictor()
    kmeans_info = predictor.get_model_info()["kmeans"]
    clusters = kmeans_info["clusters"]

    assert len(clusters) == KMEANS_N_CLUSTERS
    assert sum(c["count"] for c in clusters) == 1000

    for cluster in clusters:
        assert cluster["label"].startswith("Grupo ")
        assert len(cluster["description"]) > 20
        assert len(cluster["highlights"]) == 3
        assert 0.0 <= cluster["avg_exam_score"] <= 100.0


def test_colombian_scale_and_performance_tiers():
    assert _to_scale_5(100.0) == 5.0
    assert _to_scale_5(80.0) == 4.0
    assert _to_scale_5(60.0) == 3.0

    assert _classify_performance(78.0)[0] == "Básico"     # 3.9 / 5.0
    assert _classify_performance(80.0)[0] == "Alto"       # 4.0 / 5.0
    assert _classify_performance(90.0)[0] == "Alto"       # 4.5 / 5.0
    assert _classify_performance(92.0)[0] == "Superior"   # 4.6 / 5.0