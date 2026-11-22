package LearnPatternBackend.controller;

import LearnPatternBackend.dto.RegistroHabitoRequest;
import LearnPatternBackend.dto.RegistroHabitoResponse;
import LearnPatternBackend.service.RegistroHabitoService;
import jakarta.validation.Valid;
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
    public ResponseEntity<RegistroHabitoResponse> crearRegistro(
            @Valid @RequestBody RegistroHabitoRequest request) {
        RegistroHabitoResponse nuevoRegistro =
                registroHabitoService.crearRegistro(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRegistro);
    }

    @GetMapping
    public ResponseEntity<List<RegistroHabitoResponse>> listarRegistros() {
        return ResponseEntity.ok(registroHabitoService.listarRegistros());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroHabitoResponse> buscarPorId(
            @PathVariable UUID id) {
        return registroHabitoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<RegistroHabitoResponse>> listarPorUsuario(
            @PathVariable UUID usuarioId) {
        return ResponseEntity.ok(
                registroHabitoService.listarPorUsuario(usuarioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarRegistro(@PathVariable UUID id) {
        registroHabitoService.eliminarRegistro(id);
        return ResponseEntity.noContent().build();
    }
}