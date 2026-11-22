# LearnPattern

Sistema web basado en Inteligencia Artificial para analizar la relación entre los hábitos diarios de estudiantes universitarios y su rendimiento académico estimado (Proyecto de curso **PTIA** — Escuela Colombiana de Ingeniería Julio Garavito).

> **Aviso orientativo:** Los modelos se entrenan con el dataset público simulado *Student Habits vs Academic Performance* (1.000 registros). Las estimaciones y recomendaciones son exclusivamente orientativas y no garantizan una calificación real.

---

## Arquitectura

- **Frontend (`frontend/`):** React + Vite + Recharts (6 pestañas: Inicio, Registrar sesión, Resultado, Análisis + Simulador, Patrón K-Means con mapa 2D, y Recomendaciones + Login/Registro).
- **Backend (`backend/`):** Java 21 + Spring Boot 4 + Spring Security (JWT `HS256` + BCrypt) + JPA/PostgreSQL.
- **Servicio de IA (`ai/`):** Python + FastAPI + Scikit-Learn:
  - **Regresión Lineal:** `MAE 4.14` · `RMSE 5.12` · `R² 89.8%`
  - **Red Neuronal Densa (ReLU + GridSearchCV):** `MAE 4.28` · `RMSE 5.25` · `R² 89.2%`
  - **Baseline (promedio 69.83):** `MAE 12.38` · `RMSE 16.05`
  - **K-Means (4 grupos + PCA 2D):** Agrupación de hábitos sin usar la calificación, con explicación automática de cada grupo.
- **Base de datos (`database/`):** PostgreSQL 17 (`usuarios`, `registros_habitos`, `historial_analisis`).
- **Documentación (`docs/`):** Especificación Swagger/OpenAPI (`docs/ai-openapi.json`) y evidencias de pruebas.

---

## Ejecución rápida con Docker (recomendado)

1. Copia `.env.example` a `.env` y define tus credenciales locales:
   ```bash
   cp .env.example .env
   ```
2. Levanta los 4 servicios con un solo comando:
   ```bash
   docker compose up --build -d
   ```
3. Abre la aplicación:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080
   - **Swagger IA (FastAPI):** http://localhost:8000/docs

---

## Pruebas automatizadas (31 tests)

- **IA Python (15 pruebas):**
  ```bash
  cd ai && python -m pytest -v
  ```
- **Backend Java + Seguridad (16 pruebas):**
  ```bash
  cd backend && ./mvnw test
  ```