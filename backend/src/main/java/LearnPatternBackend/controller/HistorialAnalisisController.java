package LearnPatternBackend.controller;

import LearnPatternBackend.entity.HistorialAnalisis;
import LearnPatternBackend.service.HistorialAnalisisService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/historial-analisis")
public class HistorialAnalisisController {

    private final HistorialAnalisisService historialAnalisisService;

    public HistorialAnalisisController(
            HistorialAnalisisService historialAnalisisService) {
        this.historialAnalisisService = historialAnalisisService;
    }

    @PostMapping
    public ResponseEntity<HistorialAnalisis> guardarAnalisis(
            @RequestBody HistorialAnalisis analisis) {
        HistorialAnalisis nuevoAnalisis =
                historialAnalisisService.guardarAnalisis(analisis);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoAnalisis);
    }

    @GetMapping
    public ResponseEntity<List<HistorialAnalisis>> listarAnalisis() {
        return ResponseEntity.ok(
                historialAnalisisService.listarAnalisis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HistorialAnalisis> buscarPorId(
            @PathVariable UUID id) {
        return historialAnalisisService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/registro/{registroHabitosId}")
    public ResponseEntity<List<HistorialAnalisis>> listarPorRegistro(
            @PathVariable UUID registroHabitosId) {
        return ResponseEntity.ok(
                historialAnalisisService
                        .listarPorRegistroHabitos(registroHabitosId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAnalisis(
            @PathVariable UUID id) {
        historialAnalisisService.eliminarAnalisis(id);
        return ResponseEntity.noContent().build();
    }
}