package LearnPatternBackend.dto;

import LearnPatternBackend.entity.Usuario;
import java.time.OffsetDateTime;
import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nombre,
        String correo,
        OffsetDateTime fechaCreacion
) {
    public static UsuarioResponse fromEntity(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getFechaCreacion()
        );
    }
}