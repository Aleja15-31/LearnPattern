package LearnPatternBackend.controller;

import LearnPatternBackend.dto.HistorialAnalisisResponse;
import LearnPatternBackend.dto.RegistroHabitoRequest;
import LearnPatternBackend.dto.SimulacionRequest;
import LearnPatternBackend.service.AnalisisService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analisis")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    @PostMapping("/evaluar")
    public ResponseEntity<HistorialAnalisisResponse> evaluarHabitos(
            @Valid @RequestBody RegistroHabitoRequest request) {
        HistorialAnalisisResponse resultado = analisisService.evaluarYGuardar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(resultado);
    }

    @PostMapping("/simular")
    public ResponseEntity<Map<String, Object>> simularCambios(
            @Valid @RequestBody SimulacionRequest request) {
        return ResponseEntity.ok(analisisService.simular(request));
    }

    @GetMapping("/modelo-info")
    public ResponseEntity<Map<String, Object>> obtenerInfoModelos() {
        return ResponseEntity.ok(analisisService.obtenerInfoModelos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<HistorialAnalisisResponse>> listarPorUsuario(
            @PathVariable UUID usuarioId) {
        return ResponseEntity.ok(analisisService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/registro/{registroHabitosId}")
    public ResponseEntity<List<HistorialAnalisisResponse>> listarPorRegistro(
            @PathVariable UUID registroHabitosId) {
        return ResponseEntity.ok(analisisService.listarPorRegistro(registroHabitosId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialAnalisisResponse> buscarPorId(@PathVariable UUID id) {
        return analisisService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAnalisis(@PathVariable UUID id) {
        analisisService.eliminarAnalisis(id);
        return ResponseEntity.noContent().build();
    }
}