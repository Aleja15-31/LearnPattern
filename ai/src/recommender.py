from typing import Any


def generate_recommendations(
    habits: dict[str, Any],
    group_averages: dict[str, float],
    dataset_averages: dict[str, float],
) -> list[dict[str, Any]]:
    """
    Genera recomendaciones orientativas comparando los habitos del estudiante
    con referencias saludables y con el promedio de su grupo K-Means.
    """
    recommendations: list[dict[str, Any]] = []

    # 1. Horas de estudio al dia
    study = float(habits["study_hours_per_day"])
    study_group = float(group_averages["study_hours_per_day"])
    if study < 2.5:
        priority, impact = "alta", 90
        suggestion = (
            "Tu tiempo de estudio diario es bajo frente a los patrones con mejor rendimiento. "
            "Podrias explorar bloques cortos y constantes para aumentarlo gradualmente."
        )
    elif study < study_group or study < 4.0:
        priority, impact = "media", 60
        suggestion = (
            "Tu tiempo de estudio esta cerca o ligeramente por debajo de tu grupo. "
            "Prueba en el simulador como cambiaria tu estimacion sumando entre 30 y 60 minutos."
        )
    else:
        priority, impact = "baja", 20
        suggestion = (
            "Mantienes un buen ritmo de horas de estudio frente a tu grupo. "
            "Revisa que ese tiempo se equilibre bien con tu descanso."
        )
    recommendations.append(
        {
            "habit_key": "study_hours_per_day",
            "category": "Habito de estudio",
            "title": "Horas de estudio al dia",
            "user_value": round(study, 2),
            "group_average": round(study_group, 2),
            "dataset_average": round(float(dataset_averages["study_hours_per_day"]), 2),
            "unit": "horas",
            "priority": priority,
            "impact_score": impact,
            "suggestion": suggestion,
            "can_simulate": True,
        }
    )

    # 2. Horas de sueno
    sleep = float(habits["sleep_hours"])
    sleep_group = float(group_averages["sleep_hours"])
    if sleep < 6.0:
        priority, impact = "alta", 85
        suggestion = (
            "Dormir menos de 6 horas suele asociarse con menor concentracion y rendimiento. "
            "Evalua ajustar tu rutina nocturna para acercarte a 7 u 8 horas."
        )
    elif sleep < 7.0:
        priority, impact = "media", 55
        suggestion = (
            "Estas algo por debajo de las 7 horas recomendadas de descanso. "
            "Puedes simular si sumar media hora o una hora de sueno mejora tu estimacion."
        )
    elif sleep > 9.5:
        priority, impact = "media", 40
        suggestion = (
            "Tus horas de sueno estan por encima del promedio habitual. "
            "Revisa si tu horario de descanso es regular y te deja energia durante el dia."
        )
    else:
        priority, impact = "baja", 15
        suggestion = (
            "Tus horas de descanso se encuentran en un rango saludable. "
            "Procura mantener horarios regulares de sueno."
        )
    recommendations.append(
        {
            "habit_key": "sleep_hours",
            "category": "Descanso",
            "title": "Horas de sueno",
            "user_value": round(sleep, 2),
            "group_average": round(sleep_group, 2),
            "dataset_average": round(float(dataset_averages["sleep_hours"]), 2),
            "unit": "horas",
            "priority": priority,
            "impact_score": impact,
            "suggestion": suggestion,
            "can_simulate": True,
        }
    )

    # 3. Uso de redes sociales
    social = float(habits["social_media_hours"])
    social_group = float(group_averages["social_media_hours"])
    if social > 3.5:
        priority, impact = "alta", 80
        suggestion = (
            "El tiempo diario en redes sociales es elevado frente a la mayoria de registros. "
            "Reducirlo con limites de uso podria liberar tiempo para estudio o descanso."
        )
    elif social > social_group + 0.5 or social > 2.5:
        priority, impact = "media", 50
        suggestion = (
            "Tu uso de redes sociales esta por encima del promedio de tu grupo. "
            "Observa en que momentos del dia te distrae mas y pruebalo en el simulador."
        )
    else:
        priority, impact = "baja", 18
        suggestion = (
            "Mantienes un uso moderado de redes sociales frente a tu grupo. "
            "Sigue cuidando que no interrumpan tus bloques de estudio."
        )
    recommendations.append(
        {
            "habit_key": "social_media_hours",
            "category": "Tiempo libre",
            "title": "Horas en redes sociales",
            "user_value": round(social, 2),
            "group_average": round(social_group, 2),
            "dataset_average": round(float(dataset_averages["social_media_hours"]), 2),
            "unit": "horas",
            "priority": priority,
            "impact_score": impact,
            "suggestion": suggestion,
            "can_simulate": True,
        }
    )

    # 4. Tiempo viendo series / Netflix
    netflix = float(habits["netflix_hours"])
    netflix_group = float(group_averages["netflix_hours"])
    if netflix > 3.0:
        priority, impact = "alta", 75
        suggestion = (
            "Dedicas varias horas al dia a series o streaming. "
            "Definir un limite diario puede ayudarte a equilibrar ocio y estudio."
        )
    elif netflix > netflix_group + 0.5 or netflix > 2.0:
        priority, impact = "media", 45
        suggestion = (
            "Tu tiempo en series supera ligeramente el promedio de tu grupo. "
            "Puedes probar en el simulador como cambia el panorama reduciendolo un poco."
        )
    else:
        priority, impact = "baja", 12
        suggestion = (
            "Tu tiempo en series esta bien controlado respecto al promedio. "
            "Es positivo conservar espacios de ocio equilibrados."
        )
    recommendations.append(
        {
            "habit_key": "netflix_hours",
            "category": "Entretenimiento",
            "title": "Horas en Netflix o series",
            "user_value": round(netflix, 2),
            "group_average": round(netflix_group, 2),
            "dataset_average": round(float(dataset_averages["netflix_hours"]), 2),
            "unit": "horas",
            "priority": priority,
            "impact_score": impact,
            "suggestion": suggestion,
            "can_simulate": True,
        }
    )

    # 5. Porcentaje de asistencia
    attendance = float(habits["attendance_percentage"])
    attendance_group = float(group_averages["attendance_percentage"])
    if attendance < 75.0:
        priority, impact = "alta", 82
        suggestion = (
            "Tu porcentaje de asistencia es bajo frente al promedio. "
            "Asistir con mayor regularidad facilita seguir el ritmo de los temas."
        )
    elif attendance < attendance_group or attendance < 85.0:
        priority, impact = "media", 48
        suggestion = (
            "Tu asistencia tiene margen de mejora en comparacion con tu grupo. "
            "Revisa que factores te impiden asistir a algunas clases."
        )
    else:
        priority, impact = "baja", 14
        suggestion = (
            "Tienes un buen nivel de asistencia a clases. "
            "Mantener esa constancia respalda el resto de tus habitos."
        )
    recommendations.append(
        {
            "habit_key": "attendance_percentage",
            "category": "Asistencia",
            "title": "Asistencia a clases",
            "user_value": round(attendance, 2),
            "group_average": round(attendance_group, 2),
            "dataset_average": round(float(dataset_averages["attendance_percentage"]), 2),
            "unit": "%",
            "priority": priority,
            "impact_score": impact,
            "suggestion": suggestion,
            "can_simulate": True,
        }
    )

    # 6. Frecuencia de ejercicio
    exercise = float(habits["exercise_frequency"])
    exercise_group = float(group_averages["exercise_frequency"])
    if exercise < 1:
        priority, impact = "alta", 70
        suggestion = (
            "Actualmente no registras actividad fisica semanal. "
            "Incorporar al menos 2 sesiones cortas a la semana suele apoyar energia y bienestar."
        )
    elif exercise < 3:
        priority, impact = "media", 42
        suggestion = (
            "Haces algo de actividad fisica, pero podrias explorar subir a 3 veces por semana "
            "para acercarte a rutinas mas activas."
        )
    else:
        priority, impact = "baja", 10
        suggestion = (
            "Mantienes una frecuencia saludable de ejercicio semanal. "
            "Continuar con este habito ayuda a sostener tu bienestar general."
        )
    recommendations.append(
        {
            "habit_key": "exercise_frequency",
            "category": "Actividad",
            "title": "Frecuencia de ejercicio",
            "user_value": round(exercise, 2),
            "group_average": round(exercise_group, 2),
            "dataset_average": round(float(dataset_averages["exercise_frequency"]), 2),
            "unit": "veces/sem",
            "priority": priority,
            "impact_score": impact,
            "suggestion": suggestion,
            "can_simulate": True,
        }
    )

    # Ordenar de mayor a menor oportunidad de mejora
    recommendations.sort(key=lambda item: item["impact_score"], reverse=True)
    for idx, item in enumerate(recommendations):
        item["is_top_opportunity"] = idx == 0

    return recommendations