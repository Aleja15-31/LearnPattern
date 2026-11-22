package LearnPatternBackend.dto;

import LearnPatternBackend.entity.HistorialAnalisis;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

public record HistorialAnalisisResponse(
        UUID id,
        UUID registroHabitosId,
        String nombreModelo,
        BigDecimal notaExamenEstimada,
        BigDecimal notaEscala5,
        String patronAprendizaje,
        Map<String, Object> detalleAnalisis,
        OffsetDateTime fechaCreacion
) {
    public static HistorialAnalisisResponse fromEntity(
            HistorialAnalisis analisis,
            Map<String, Object> detalleAnalisis) {
        return new HistorialAnalisisResponse(
                analisis.getId(),
                analisis.getRegistroHabito().getId(),
                analisis.getNombreModelo(),
                analisis.getNotaExamenEstimada(),
                analisis.getNotaEscala5(),
                analisis.getPatronAprendizaje(),
                detalleAnalisis,
                analisis.getFechaCreacion()
        );
    }
}