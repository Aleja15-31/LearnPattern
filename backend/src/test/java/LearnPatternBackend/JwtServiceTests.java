package LearnPatternBackend;

import LearnPatternBackend.security.JwtService;
import java.util.UUID;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTests {

    private static final String SECRET_VALIDO =
            "LearnPattern_Secret_Test_Key_2026_Minimo_32_Caracteres";

    @Test
    void generarYValidarTokenCorrectamente() {
        JwtService jwtService = new JwtService(SECRET_VALIDO, 60_000L);
        UUID userId = UUID.randomUUID();
        String correo = "paula.jwt@learnpattern.com";

        String token = jwtService.generateToken(userId, correo);

        assertThat(token).isNotBlank();
        assertThat(jwtService.isTokenValid(token)).isTrue();
        assertThat(jwtService.extractCorreo(token)).isEqualTo(correo);
    }

    @Test
    void tokenManipuladoEsRechazado() {
        JwtService jwtService = new JwtService(SECRET_VALIDO, 60_000L);
        String token = jwtService.generateToken(UUID.randomUUID(), "user@test.com");
        String tokenAlterado = token.substring(0, token.length() - 2) + "xx";

        assertThat(jwtService.isTokenValid(tokenAlterado)).isFalse();
    }

    @Test
    void tokenExpiradoEsRechazado() {
        JwtService jwtService = new JwtService(SECRET_VALIDO, -1_000L);
        String tokenExpirado = jwtService.generateToken(UUID.randomUUID(), "exp@test.com");

        assertThat(jwtService.isTokenValid(tokenExpirado)).isFalse();
    }

    @Test
    void claveSecretaCortaLanzaExcepcion() {
        assertThatThrownBy(() -> new JwtService("clave_muy_corta", 60_000L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("32 caracteres");
    }
}