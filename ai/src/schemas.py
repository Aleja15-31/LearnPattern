from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class StudentHabitsInput(BaseModel):
    """Datos de entrada completos de los habitos de un estudiante."""

    age: int = Field(..., ge=10, le=100, description="Edad del estudiante en anios")
    gender: Literal["Female", "Male", "Other"]
    study_hours_per_day: float = Field(..., ge=0.0, le=24.0)
    social_media_hours: float = Field(..., ge=0.0, le=24.0)
    netflix_hours: float = Field(..., ge=0.0, le=24.0)
    part_time_job: Literal["Yes", "No"]
    attendance_percentage: float = Field(..., ge=0.0, le=100.0)
    sleep_hours: float = Field(..., ge=0.0, le=24.0)
    diet_quality: Literal["Poor", "Fair", "Good"]
    exercise_frequency: int = Field(..., ge=0, le=7)
    parental_education_level: Literal["None", "High School", "Bachelor", "Master"]
    internet_quality: Literal["Poor", "Average", "Good"]
    mental_health_rating: int = Field(..., ge=1, le=10)
    extracurricular_participation: Literal["Yes", "No"]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
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
        }
    )


class HabitChangesInput(BaseModel):
    """Habitos opcionales que el usuario modifica en el simulador."""

    study_hours_per_day: Optional[float] = Field(default=None, ge=0.0, le=24.0)
    social_media_hours: Optional[float] = Field(default=None, ge=0.0, le=24.0)
    netflix_hours: Optional[float] = Field(default=None, ge=0.0, le=24.0)
    attendance_percentage: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    sleep_hours: Optional[float] = Field(default=None, ge=0.0, le=24.0)
    exercise_frequency: Optional[int] = Field(default=None, ge=0, le=7)
    mental_health_rating: Optional[int] = Field(default=None, ge=1, le=10)
    part_time_job: Optional[Literal["Yes", "No"]] = None
    diet_quality: Optional[Literal["Poor", "Fair", "Good"]] = None
    internet_quality: Optional[Literal["Poor", "Average", "Good"]] = None
    extracurricular_participation: Optional[Literal["Yes", "No"]] = None


class SimulationRequest(BaseModel):
    """Peticion para simular escenarios comparando habitos actuales vs modificados."""

    current_habits: StudentHabitsInput
    changes: HabitChangesInput

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "current_habits": {
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
                },
                "changes": {
                    "study_hours_per_day": 6.0,
                    "sleep_hours": 8.0,
                },
            }
        }
    )