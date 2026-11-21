package LearnPatternBackend.service;

import LearnPatternBackend.client.AiServiceClient;
import LearnPatternBackend.dto.HistorialAnalisisResponse;
import LearnPatternBackend.dto.RegistroHabitoRequest;
import LearnPatternBackend.dto.SimulacionRequest;
import LearnPatternBackend.entity.HistorialAnalisis;
import LearnPatternBackend.entity.RegistroHabito;
import LearnPatternBackend.repository.HistorialAnalisisRepository;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

@Service
@Transactional
public class AnalisisService {

    private final RegistroHabitoService registroHabitoService;
    private final HistorialAnalisisRepository historialAnalisisRepository;
    private final AiServiceClient aiServiceClient;
    private final JsonMapper jsonMapper;

    public AnalisisService(
            RegistroHabitoService registroHabitoService,
            HistorialAnalisisRepository historialAnalisisRepository,
            AiServiceClient aiServiceClient,
            JsonMapper jsonMapper) {
        this.registroHabitoService = registroHabitoService;
        this.historialAnalisisRepository = historialAnalisisRepository;
        this.aiServiceClient = aiServiceClient;
        this.jsonMapper = jsonMapper;
    }

    public HistorialAnalisisResponse evaluarYGuardar(RegistroHabitoRequest request) {
        // 1. Consultar primero al servicio de IA en Python
        Map<String, Object> resultadoIa = aiServiceClient.predict(request);

        // 2. Guardar los habitos del estudiante en PostgreSQL
        RegistroHabito registroGuardado = registroHabitoService.crearEntidad(request);

        // 3. Guardar el analisis generado en historial_analisis
        HistorialAnalisis analisis = new HistorialAnalisis();
        analisis.setRegistroHabito(registroGuardado);
        analisis.setNombreModelo(String.valueOf(resultadoIa.getOrDefault("best_model", "desconocido")));

        Object nota100 = resultadoIa.get("estimated_score");
        if (nota100 != null) {
            analisis.setNotaExamenEstimada(new BigDecimal(String.valueOf(nota100)));
        }

        Object nota5 = resultadoIa.get("estimated_score_scale_5");
        if (nota5 != null) {
            analisis.setNotaEscala5(new BigDecimal(String.valueOf(nota5)));
        }

        Object clusterObj = resultadoIa.get("cluster");
        if (clusterObj instanceof Map<?, ?> clusterMap && clusterMap.get("label") != null) {
            analisis.setPatronAprendizaje(String.valueOf(clusterMap.get("label")));
        }

        analisis.setResultadoJson(jsonMapper.writeValueAsString(resultadoIa));

        HistorialAnalisis guardado = historialAnalisisRepository.save(analisis);
        return HistorialAnalisisResponse.fromEntity(guardado, resultadoIa);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> simular(SimulacionRequest request) {
        return aiServiceClient.simulate(request.habitosActuales(), request.cambios());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> obtenerInfoModelos() {
        return aiServiceClient.getModelInfo();
    }

    @Transactional(readOnly = true)
    public List<HistorialAnalisisResponse> listarPorUsuario(UUID usuarioId) {
        return historialAnalisisRepository
                .findByRegistroHabitoUsuarioIdOrderByFechaCreacionDesc(usuarioId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<HistorialAnalisisResponse> listarPorRegistro(UUID registroHabitosId) {
        return historialAnalisisRepository
                .findByRegistroHabitoId(registroHabitosId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<HistorialAnalisisResponse> buscarPorId(UUID id) {
        return historialAnalisisRepository.findById(id).map(this::toResponse);
    }

    public void eliminarAnalisis(UUID id) {
        historialAnalisisRepository.deleteById(id);
    }

    private HistorialAnalisisResponse toResponse(HistorialAnalisis entity) {
        Map<String, Object> detalle = Collections.emptyMap();
        if (entity.getResultadoJson() != null && !entity.getResultadoJson().isBlank()) {
            try {
                detalle = jsonMapper.readValue(
                        entity.getResultadoJson(),
                        new TypeReference<Map<String, Object>>() {}
                );
            } catch (Exception ignored) {
                detalle = Collections.emptyMap();
            }
        }
        return HistorialAnalisisResponse.fromEntity(entity, detalle);
    }
}