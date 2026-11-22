package LearnPatternBackend;

import LearnPatternBackend.entity.Usuario;
import LearnPatternBackend.repository.UsuarioRepository;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class SecurityFlowTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void rutasProtegidasSinTokenDevuelven401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.mensaje").exists());

        mockMvc.perform(get("/api/analisis/mios"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenInvalidoOManipuladoDevuelve401() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer token.falso.invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registroEncriptaContrasenaConBCryptYNoLaExponeEnJson() throws Exception {
        String correo = "test.bcrypt@learnpattern.com";
        String contrasenaPlana = "ClaveSuperSecreta123";

        String body = jsonMapper.writeValueAsString(Map.of(
                "nombre", "Estudiante BCrypt",
                "correo", correo,
                "contrasena", contrasenaPlana
        ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.correo").value(correo))
                .andExpect(jsonPath("$.usuario.hashContrasena").doesNotExist());

        Usuario guardado = usuarioRepository.findByCorreo(correo).orElseThrow();
        assertThat(guardado.getHashContrasena()).isNotEqualTo(contrasenaPlana);
        assertThat(guardado.getHashContrasena()).startsWith("$2");
    }

    @Test
    void loginRechazaClaveIncorrectaYAceptaClaveCorrecta() throws Exception {
        String correo = "test.login@learnpattern.com";
        String contrasena = "MiPassword2026";
        registrarYExtraer(correo, contrasena);

        String loginMalo = jsonMapper.writeValueAsString(Map.of(
                "correo", correo,
                "contrasena", "ClaveEquivocada"
        ));
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginMalo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.mensaje").value("Correo o contrasena incorrectos."));

        String loginBueno = jsonMapper.writeValueAsString(Map.of(
                "correo", correo,
                "contrasena", contrasena
        ));
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBueno))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.usuario.correo").value(correo));
    }

    @Test
    void tokenValidoPermiteAccederARutasPrivadas() throws Exception {
        String correo = "test.acceso@learnpattern.com";
        JsonNode auth = registrarYExtraer(correo, "PasswordValido123");
        String token = auth.get("token").asText();

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.correo").value(correo));

        mockMvc.perform(get("/api/analisis/mios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void usuarioNoPuedeConsultarHistorialDeOtroUsuario() throws Exception {
        JsonNode usuarioA = registrarYExtraer("usuario.a@learnpattern.com", "PasswordA123");
        JsonNode usuarioB = registrarYExtraer("usuario.b@learnpattern.com", "PasswordB123");

        String tokenA = usuarioA.get("token").asText();
        String idUsuarioB = usuarioB.get("usuario").get("id").asText();

        mockMvc.perform(get("/api/analisis/usuario/" + idUsuarioB)
                        .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isForbidden());
    }

    private JsonNode registrarYExtraer(String correo, String contrasena) throws Exception {
        String body = jsonMapper.writeValueAsString(Map.of(
                "nombre", "Estudiante Test",
                "correo", correo,
                "contrasena", contrasena
        ));

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        return jsonMapper.readTree(result.getResponse().getContentAsString());
    }
}