package LearnPatternBackend.dto;

import LearnPatternBackend.entity.RegistroHabito;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record RegistroHabitoResponse(
        UUID id,
        UUID usuarioId,
        Short edad,
        String genero,
        BigDecimal horasEstudioDia,
        BigDecimal horasRedesSociales,
        BigDecimal horasNetflix,
        boolean trabajoMedioTiempo,
        BigDecimal porcentajeAsistencia,
        BigDecimal horasSueno,
        String calidadAlimentacion,
        Short frecuenciaEjercicio,
        String nivelEducacionPadres,
        String calidadInternet,
        Short valoracionSaludMental,
        boolean participaExtracurriculares,
        OffsetDateTime fechaCreacion
) {
    public static RegistroHabitoResponse fromEntity(RegistroHabito registro) {
        return new RegistroHabitoResponse(
                registro.getId(),
                registro.getUsuario().getId(),
                registro.getEdad(),
                registro.getGenero(),
                registro.getHorasEstudioDia(),
                registro.getHorasRedesSociales(),
                registro.getHorasNetflix(),
                registro.isTrabajoMedioTiempo(),
                registro.getPorcentajeAsistencia(),
                registro.getHorasSueno(),
                registro.getCalidadAlimentacion(),
                registro.getFrecuenciaEjercicio(),
                registro.getNivelEducacionPadres(),
                registro.getCalidadInternet(),
                registro.getValoracionSaludMental(),
                registro.isParticipaExtracurriculares(),
                registro.getFechaCreacion()
        );
    }
}