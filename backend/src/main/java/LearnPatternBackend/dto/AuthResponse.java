package LearnPatternBackend.dto;

public record AuthResponse(
        String token,
        UsuarioResponse usuario
) {
}