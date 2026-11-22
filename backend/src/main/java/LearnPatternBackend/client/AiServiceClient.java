package LearnPatternBackend.client;

import LearnPatternBackend.dto.RegistroHabitoRequest;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
public class AiServiceClient {

    private static final ParameterizedTypeReference<Map<String, Object>> MAP_TYPE =
            new ParameterizedTypeReference<>() {};

    private static final Map<String, String> SPANISH_TO_AI_KEYS = Map.ofEntries(
            Map.entry("horasEstudioDia", "study_hours_per_day"),
            Map.entry("horasRedesSociales", "social_media_hours"),
            Map.entry("horasNetflix", "netflix_hours"),
            Map.entry("porcentajeAsistencia", "attendance_percentage"),
            Map.entry("horasSueno", "sleep_hours"),
            Map.entry("frecuenciaEjercicio", "exercise_frequency"),
            Map.entry("valoracionSaludMental", "mental_health_rating"),
            Map.entry("trabajoMedioTiempo", "part_time_job"),
            Map.entry("calidadAlimentacion", "diet_quality"),
            Map.entry("calidadInternet", "internet_quality"),
            Map.entry("participaExtracurriculares", "extracurricular_participation")
    );

    private final RestClient restClient;
    private final String aiServiceUrl;

    public AiServiceClient(@Value("${ai.service.url:http://localhost:8000}") String aiServiceUrl) {
        this.aiServiceUrl = aiServiceUrl;
        this.restClient = RestClient.builder()
                .baseUrl(aiServiceUrl)
                .build();
    }

    public Map<String, Object> predict(RegistroHabitoRequest request) {
        Map<String, Object> payload = toAiHabitsPayload(request);
        try {
            return restClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(MAP_TYPE);
        } catch (RestClientException ex) {
            throw new IllegalStateException(
                    "No se pudo obtener la prediccion del servicio de IA en " + aiServiceUrl, ex
            );
        }
    }

    public Map<String, Object> simulate(
            RegistroHabitoRequest currentHabits,
            Map<String, Object> cambios) {
        Map<String, Object> payload = Map.of(
                "current_habits", toAiHabitsPayload(currentHabits),
                "changes", translateChanges(cambios)
        );
        try {
            return restClient.post()
                    .uri("/simulate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(MAP_TYPE);
        } catch (RestClientException ex) {
            throw new IllegalStateException(
                    "No se pudo ejecutar la simulacion en el servicio de IA en " + aiServiceUrl, ex
            );
        }
    }

    public Map<String, Object> getModelInfo() {
        try {
            return restClient.get()
                    .uri("/model-info")
                    .retrieve()
                    .body(MAP_TYPE);
        } catch (RestClientException ex) {
            throw new IllegalStateException(
                    "No se pudo consultar la informacion de modelos en " + aiServiceUrl, ex
            );
        }
    }

    public Map<String, Object> checkHealth() {
        try {
            return restClient.get()
                    .uri("/health")
                    .retrieve()
                    .body(MAP_TYPE);
        } catch (RestClientException ex) {
            throw new IllegalStateException(
                    "El servicio de IA no responde en " + aiServiceUrl, ex
            );
        }
    }

    private Map<String, Object> toAiHabitsPayload(RegistroHabitoRequest req) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("age", req.edad());
        map.put("gender", req.genero());
        map.put("study_hours_per_day", req.horasEstudioDia());
        map.put("social_media_hours", req.horasRedesSociales());
        map.put("netflix_hours", req.horasNetflix());
        map.put("part_time_job", Boolean.TRUE.equals(req.trabajoMedioTiempo()) ? "Yes" : "No");
        map.put("attendance_percentage", req.porcentajeAsistencia());
        map.put("sleep_hours", req.horasSueno());
        map.put("diet_quality", req.calidadAlimentacion());
        map.put("exercise_frequency", req.frecuenciaEjercicio());
        map.put("parental_education_level", req.nivelEducacionPadres());
        map.put("internet_quality", req.calidadInternet());
        map.put("mental_health_rating", req.valoracionSaludMental());
        map.put(
                "extracurricular_participation",
                Boolean.TRUE.equals(req.participaExtracurriculares()) ? "Yes" : "No"
        );
        return map;
    }

    private Map<String, Object> translateChanges(Map<String, Object> cambios) {
        Map<String, Object> translated = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : cambios.entrySet()) {
            String aiKey = SPANISH_TO_AI_KEYS.getOrDefault(entry.getKey(), entry.getKey());
            Object value = entry.getValue();
            if (("part_time_job".equals(aiKey) || "extracurricular_participation".equals(aiKey))
                    && value instanceof Boolean boolVal) {
                value = boolVal ? "Yes" : "No";
            }
            translated.put(aiKey, value);
        }
        return translated;
    }
}