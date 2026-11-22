import pytest
from fastapi.testclient import TestClient

from src.main import app


SAMPLE_HABITS = {
    "age": 20,
    "gender": "Female",
    "study_hours_per_day": 3.0,
    "social_media_hours": 3.5,
    "netflix_hours": 2.0,
    "part_time_job": "No",
    "attendance_percentage": 80.0,
    "sleep_hours": 6.0,
    "diet_quality": "Fair",
    "exercise_frequency": 2,
    "parental_education_level": "Bachelor",
    "internet_quality": "Good",
    "mental_health_rating": 6,
    "extracurricular_participation": "Yes",
}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health_endpoint(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["best_model"] in ("linear_regression", "neural_network")


def test_model_info_beats_baseline(client: TestClient):
    response = client.get("/model-info")
    assert response.status_code == 200
    data = response.json()

    baseline_rmse = data["metrics"]["baseline"]["rmse"]
    linear_rmse = data["metrics"]["linear_regression"]["rmse"]
    neural_rmse = data["metrics"]["neural_network"]["rmse"]

    assert linear_rmse < baseline_rmse
    assert neural_rmse < baseline_rmse
    assert data["kmeans"]["n_clusters"] == 4
    assert len(data["kmeans"]["clusters"]) == 4


def test_predict_valid_habits(client: TestClient):
    response = client.post("/predict", json=SAMPLE_HABITS)
    assert response.status_code == 200
    data = response.json()

    assert 0.0 <= data["estimated_score"] <= 100.0
    assert 0.0 <= data["estimated_score_scale_5"] <= 5.0
    assert "linear_regression" in data["model_comparison"]
    assert "neural_network" in data["model_comparison"]
    assert "user_point" in data["cluster"]
    assert len(data["recommendations"]) == 6
    assert sum(1 for r in data["recommendations"] if r["is_top_opportunity"]) == 1
    assert "orientativas" in data["disclaimer"].lower()


def test_predict_invalid_habits_returns_422(client: TestClient):
    invalid_payload = {**SAMPLE_HABITS, "sleep_hours": -4.0, "attendance_percentage": 150.0}
    response = client.post("/predict", json=invalid_payload)
    assert response.status_code == 422


def test_simulate_improvement_increases_score(client: TestClient):
    payload = {
        "current_habits": SAMPLE_HABITS,
        "changes": {
            "study_hours_per_day": 6.0,
            "sleep_hours": 8.0,
            "social_media_hours": 1.0,
        },
    }
    response = client.post("/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert 0.0 <= data["simulated_score"] <= 100.0
    assert 0.0 <= data["simulated_score_scale_5"] <= 5.0
    assert data["simulated_score"] > data["current_score"]
    assert data["score_difference"] > 0


def test_simulate_without_changes_returns_400(client: TestClient):
    payload = {"current_habits": SAMPLE_HABITS, "changes": {}}
    response = client.post("/simulate", json=payload)
    assert response.status_code == 400