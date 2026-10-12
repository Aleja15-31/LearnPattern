package LearnPatternBackend.controller;

import LearnPatternBackend.entity.RegistroHabito;
import LearnPatternBackend.service.RegistroHabitoService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registros-habitos")
public class RegistroHabitoController {

    private final RegistroHabitoService registroHabitoService;

    public RegistroHabitoController(
            RegistroHabitoService registroHabitoService) {
        this.registroHabitoService = registroHabitoService;
    }

    @PostMapping
    public ResponseEntity<RegistroHabito> crearRegistro(
            @RequestBody RegistroHabito registro) {
        RegistroHabito nuevoRegistro =
                registroHabitoService.crearRegistro(registro);

        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRegistro);
    }

    @GetMapping
    public ResponseEntity<List<RegistroHabito>> listarRegistros() {
        return ResponseEntity.ok(
                registroHabitoService.listarRegistros());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroHabito> buscarPorId(
            @PathVariable UUID id) {
        return registroHabitoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RegistroHabito>> listarPorUsuario(
            @PathVariable UUID usuarioId) {
        return ResponseEntity.ok(
                registroHabitoService.listarPorUsuario(usuarioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRegistro(
            @PathVariable UUID id) {
        registroHabitoService.eliminarRegistro(id);
        return ResponseEntity.noContent().build();
    }
}