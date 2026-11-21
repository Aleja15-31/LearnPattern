package LearnPatternBackend.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.util.UUID;

public record RegistroHabitoRequest(
        @NotNull(message = "El usuarioId es obligatorio.")
        UUID usuarioId,

        @NotNull(message = "La edad es obligatoria.")
        @Min(value = 10, message = "La edad minima es 10.")
        @Max(value = 100, message = "La edad maxima es 100.")
        Short edad,

        @NotBlank(message = "El genero es obligatorio.")
        @Pattern(regexp = "Female|Male|Other", message = "El genero debe ser Female, Male u Other.")
        String genero,

        @NotNull(message = "Las horas de estudio son obligatorias.")
        @DecimalMin(value = "0.0", message = "Las horas de estudio no pueden ser negativas.")
        @DecimalMax(value = "24.0", message = "Las horas de estudio no pueden superar 24.")
        BigDecimal horasEstudioDia,

        @NotNull(message = "Las horas en redes sociales son obligatorias.")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "24.0")
        BigDecimal horasRedesSociales,

        @NotNull(message = "Las horas en Netflix son obligatorias.")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "24.0")
        BigDecimal horasNetflix,

        @NotNull(message = "Debes indicar si tienes trabajo de medio tiempo.")
        Boolean trabajoMedioTiempo,

        @NotNull(message = "El porcentaje de asistencia es obligatorio.")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "100.0")
        BigDecimal porcentajeAsistencia,

        @NotNull(message = "Las horas de sueno son obligatorias.")
        @DecimalMin(value = "0.0")
        @DecimalMax(value = "24.0")
        BigDecimal horasSueno,

        @NotBlank(message = "La calidad de alimentacion es obligatoria.")
        @Pattern(regexp = "Poor|Fair|Good", message = "La calidad de alimentacion debe ser Poor, Fair o Good.")
        String calidadAlimentacion,

        @NotNull(message = "La frecuencia de ejercicio es obligatoria.")
        @Min(value = 0, message = "La frecuencia de ejercicio minima es 0.")
        @Max(value = 7, message = "La frecuencia de ejercicio maxima es 7.")
        Short frecuenciaEjercicio,

        @NotBlank(message = "El nivel educativo de los padres es obligatorio.")
        @Pattern(
                regexp = "None|High School|Bachelor|Master",
                message = "El nivel educativo debe ser None, High School, Bachelor o Master."
        )
        String nivelEducacionPadres,

        @NotBlank(message = "La calidad de internet es obligatoria.")
        @Pattern(regexp = "Poor|Average|Good", message = "La calidad de internet debe ser Poor, Average o Good.")
        String calidadInternet,

        @NotNull(message = "La valoracion de salud mental es obligatoria.")
        @Min(value = 1, message = "La salud mental minima es 1.")
        @Max(value = 10, message = "La salud mental maxima es 10.")
        Short valoracionSaludMental,

        @NotNull(message = "Debes indicar si participas en actividades extracurriculares.")
        Boolean participaExtracurriculares
) {
}