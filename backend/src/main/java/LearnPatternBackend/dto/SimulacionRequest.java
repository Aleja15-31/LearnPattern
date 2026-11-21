package LearnPatternBackend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record SimulacionRequest(
        @NotNull(message = "Los habitos actuales son obligatorios.")
        @Valid
        RegistroHabitoRequest habitosActuales,

        @NotEmpty(message = "Debes enviar al menos un habito modificado para simular.")
        Map<String, Object> cambios
) {
}