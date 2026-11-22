import os
from contextlib import asynccontextmanager
from typing import Any
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from src.predictor import LearnPatternPredictor
from src.schemas import SimulationRequest, StudentHabitsInput


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Carga los modelos entrenados una sola vez al iniciar el servidor."""
    app.state.predictor = LearnPatternPredictor()
    yield


app = FastAPI(
    title="LearnPattern AI Service",
    description=(
        "Servicio de inteligencia artificial para estimar rendimiento academico, "
        "agrupar patrones de habitos con K-Means, simular cambios y generar "
        "recomendaciones orientativas."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:8080",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_predictor(request: Request) -> LearnPatternPredictor:
    predictor = getattr(request.app.state, "predictor", None)
    if predictor is None:
        raise HTTPException(
            status_code=503,
            detail="El servicio de modelos aun no esta listo.",
        )
    return predictor


@app.get("/health")
def health_check(request: Request) -> dict[str, Any]:
    """Verifica que el servicio este activo y con modelos cargados."""
    predictor = _get_predictor(request)
    return {
        "status": "ok",
        "service": "learnpattern-ai",
        "best_model": predictor.metadata["best_model"],
    }


@app.get("/model-info")
def get_model_info(request: Request) -> dict[str, Any]:
    """Devuelve las metricas de evaluacion, promedios del dataset y grupos K-Means."""
    predictor = _get_predictor(request)
    return predictor.get_model_info()


@app.post("/predict")
def predict_performance(
    habits: StudentHabitsInput,
    request: Request,
) -> dict[str, Any]:
    """Analiza los habitos ingresados y devuelve estimacion, grupo y recomendaciones."""
    predictor = _get_predictor(request)
    return predictor.predict(habits.model_dump())


@app.post("/simulate")
def simulate_changes(
    payload: SimulationRequest,
    request: Request,
) -> dict[str, Any]:
    """Simula como cambia la nota estimada al ajustar uno o varios habitos."""
    predictor = _get_predictor(request)
    changes = payload.changes.model_dump(exclude_none=True)
    if not changes:
        raise HTTPException(
            status_code=400,
            detail="Debes enviar al menos un habito modificado para simular.",
        )
    return predictor.simulate(payload.current_habits.model_dump(), changes)