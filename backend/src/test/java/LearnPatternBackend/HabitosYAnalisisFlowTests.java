package LearnPatternBackend;

import LearnPatternBackend.client.AiServiceClient;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class HabitosYAnalisisFlowTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @MockitoBean
    private AiServiceClient aiServiceClient;

    @Test
    void evaluarHabitosGuardaEnPostgresYPermiteRecuperarLosHabitosGuardados() throws Exception {
        JsonNode auth = registrarUsuario("paula.flujo@learnpattern.com", "Password123");
        String token = auth.get("token").asText();
        String usuarioId = auth.get("usuario").get("id").asText();

        when(aiServiceClient.predict(any())).thenReturn(Map.of(
                "best_model", "linear_regression",
                "estimated_score", 84.5,
                "estimated_score_scale_5", 4.23,
                "cluster", Map.of("label", "Grupo 3", "description", "Habitos equilibrados")
        ));

        String payload = jsonMapper.writeValueAsString(crearPayloadHabitos(usuarioId, 5.0, 7.5, 92.0));

        MvcResult evalResult = mockMvc.perform(post("/api/analisis/evaluar")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.notaExamenEstimada").value(84.5))
                .andExpect(jsonPath("$.notaEscala5").value(4.23))
                .andExpect(jsonPath("$.patronAprendizaje").value("Grupo 3"))
                .andReturn();

        JsonNode analisisJson = jsonMapper.readTree(evalResult.getResponse().getContentAsString());
        String registroId = analisisJson.get("registroHabitosId").asText();

        // Comprobar que el historial del usuario contiene el analisis guardado
        mockMvc.perform(get("/api/analisis/mios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].patronAprendizaje").value("Grupo 3"));

        // Comprobar persistencia real de los habitos exactos que ingreso el usuario
        mockMvc.perform(get("/api/registros-habitos/" + registroId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.horasEstudioDia").value(5.0))
                .andExpect(jsonPath("$.horasSueno").value(7.5))
                .andExpect(jsonPath("$.porcentajeAsistencia").value(92.0));
    }

    @Test
    void evaluarHabitosRechazaDatosFueraDeRangoCon400() throws Exception {
        JsonNode auth = registrarUsuario("paula.invalido@learnpattern.com", "Password123");
        String token = auth.get("token").asText();
        String usuarioId = auth.get("usuario").get("id").asText();

        String payloadInvalido = jsonMapper.writeValueAsString(
                crearPayloadHabitos(usuarioId, -3.0, 7.0, 150.0)
        );

        mockMvc.perform(post("/api/analisis/evaluar")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadInvalido))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errores.horasEstudioDia").exists())
                .andExpect(jsonPath("$.errores.porcentajeAsistencia").exists());
    }

    @Test
    void evaluarHabitosParaOtroUsuarioDevuelve403() throws Exception {
        JsonNode userA = registrarUsuario("user.a.eval@learnpattern.com", "Password123");
        JsonNode userB = registrarUsuario("user.b.eval@learnpattern.com", "Password123");

        String tokenA = userA.get("token").asText();
        String idB = userB.get("usuario").get("id").asText();

        String payload = jsonMapper.writeValueAsString(crearPayloadHabitos(idB, 4.0, 7.0, 85.0));

        mockMvc.perform(post("/api/analisis/evaluar")
                        .header("Authorization", "Bearer " + tokenA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden());
    }

    @Test
    void simularHabitosRespondeCorrectamenteSinEnsuciarHistorial() throws Exception {
        JsonNode auth = registrarUsuario("paula.sim@learnpattern.com", "Password123");
        String token = auth.get("token").asText();
        String usuarioId = auth.get("usuario").get("id").asText();

        when(aiServiceClient.simulate(any(), any())).thenReturn(Map.of(
                "current_score", 78.0,
                "simulated_score", 89.5,
                "score_difference", 11.5
        ));

        String simBody = jsonMapper.writeValueAsString(Map.of(
                "habitosActuales", crearPayloadHabitos(usuarioId, 3.5, 6.5, 80.0),
                "cambios", Map.of("horasEstudioDia", 6.0, "horasSueno", 8.0)
        ));

        mockMvc.perform(post("/api/analisis/simular")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(simBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.simulated_score").value(89.5))
                .andExpect(jsonPath("$.score_difference").value(11.5));

        // Confirmar que simular no guarda registros basura en PostgreSQL
        mockMvc.perform(get("/api/analisis/mios")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void eliminarAnalisisBorraRegistroCorrectamente() throws Exception {
        JsonNode auth = registrarUsuario("paula.delete@learnpattern.com", "Password123");
        String token = auth.get("token").asText();
        String usuarioId = auth.get("usuario").get("id").asText();

        when(aiServiceClient.predict(any())).thenReturn(Map.of(
                "best_model", "linear_regression",
                "estimated_score", 75.0,
                "estimated_score_scale_5", 3.75,
                "cluster", Map.of("label", "Grupo 2")
        ));

        String payload = jsonMapper.writeValueAsString(crearPayloadHabitos(usuarioId, 4.0, 7.0, 88.0));
        MvcResult created = mockMvc.perform(post("/api/analisis/evaluar")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andReturn();

        String analisisId = jsonMapper.readTree(created.getResponse().getContentAsString())
                .get("id").asText();

        mockMvc.perform(delete("/api/analisis/" + analisisId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/analisis/" + analisisId)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    private JsonNode registrarUsuario(String correo, String contrasena) throws Exception {
        String body = jsonMapper.writeValueAsString(Map.of(
                "nombre", "Estudiante Flujo",
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

    private Map<String, Object> crearPayloadHabitos(
            String usuarioId,
            double estudio,
            double sueno,
            double asistencia) {
        return Map.ofEntries(
                Map.entry("usuarioId", usuarioId),
                Map.entry("edad", 20),
                Map.entry("genero", "Female"),
                Map.entry("horasEstudioDia", estudio),
                Map.entry("horasRedesSociales", 2.0),
                Map.entry("horasNetflix", 1.0),
                Map.entry("trabajoMedioTiempo", false),
                Map.entry("porcentajeAsistencia", asistencia),
                Map.entry("horasSueno", sueno),
                Map.entry("calidadAlimentacion", "Good"),
                Map.entry("frecuenciaEjercicio", 3),
                Map.entry("nivelEducacionPadres", "Bachelor"),
                Map.entry("calidadInternet", "Good"),
                Map.entry("valoracionSaludMental", 7),
                Map.entry("participaExtracurriculares", true)
        );
    }
}