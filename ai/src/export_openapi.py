import json
from src.config import BASE_DIR
from src.main import app


def export_openapi_spec() -> None:
    """Exporta la especificacion OpenAPI (Swagger) de FastAPI a la carpeta docs/."""
    output_path = BASE_DIR.parent / "docs" / "ai-openapi.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    spec = app.openapi()
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(spec, f, indent=2, ensure_ascii=False)

    print(f"Especificacion OpenAPI (Swagger) guardada en: {output_path}")


if __name__ == "__main__":
    export_openapi_spec()