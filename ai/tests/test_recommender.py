from src.recommender import generate_recommendations


GROUP_AVERAGES = {
    "study_hours_per_day": 4.0,
    "sleep_hours": 7.0,
    "social_media_hours": 2.2,
    "netflix_hours": 1.5,
    "attendance_percentage": 85.0,
    "exercise_frequency": 3.0,
    "mental_health_rating": 6.5,
}


def test_low_study_and_sleep_receive_high_priority():
    habits = {
        "study_hours_per_day": 1.5,
        "sleep_hours": 5.0,
        "social_media_hours": 1.5,
        "netflix_hours": 1.0,
        "attendance_percentage": 90.0,
        "exercise_frequency": 4,
    }
    recs = generate_recommendations(habits, GROUP_AVERAGES, GROUP_AVERAGES)
    by_key = {r["habit_key"]: r for r in recs}

    assert by_key["study_hours_per_day"]["priority"] == "alta"
    assert by_key["sleep_hours"]["priority"] == "alta"


def test_healthy_habits_receive_low_priority():
    habits = {
        "study_hours_per_day": 5.0,
        "sleep_hours": 8.0,
        "social_media_hours": 1.0,
        "netflix_hours": 1.0,
        "attendance_percentage": 95.0,
        "exercise_frequency": 4,
    }
    recs = generate_recommendations(habits, GROUP_AVERAGES, GROUP_AVERAGES)
    assert all(r["priority"] == "baja" for r in recs)


def test_excessive_screens_trigger_high_priority():
    habits = {
        "study_hours_per_day": 4.5,
        "sleep_hours": 7.5,
        "social_media_hours": 5.0,
        "netflix_hours": 4.5,
        "attendance_percentage": 90.0,
        "exercise_frequency": 3,
    }
    recs = generate_recommendations(habits, GROUP_AVERAGES, GROUP_AVERAGES)
    by_key = {r["habit_key"]: r for r in recs}

    assert by_key["social_media_hours"]["priority"] == "alta"
    assert by_key["netflix_hours"]["priority"] == "alta"


def test_recommendations_sorted_descending_with_single_top_opportunity():
    habits = {
        "study_hours_per_day": 2.0,
        "sleep_hours": 6.5,
        "social_media_hours": 4.0,
        "netflix_hours": 2.0,
        "attendance_percentage": 70.0,
        "exercise_frequency": 0,
    }
    recs = generate_recommendations(habits, GROUP_AVERAGES, GROUP_AVERAGES)
    scores = [r["impact_score"] for r in recs]

    assert len(recs) == 6
    assert scores == sorted(scores, reverse=True)
    assert recs[0]["is_top_opportunity"] is True
    assert sum(1 for r in recs if r["is_top_opportunity"]) == 1