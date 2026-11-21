package LearnPatternBackend.service;

import LearnPatternBackend.dto.UsuarioRequest;
import LearnPatternBackend.dto.UsuarioResponse;
import LearnPatternBackend.entity.Usuario;
import LearnPatternBackend.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public UsuarioResponse crearUsuario(UsuarioRequest request) {
        String correoNormalizado = request.correo().trim().toLowerCase();
        if (usuarioRepository.existsByCorreo(correoNormalizado)) {
            throw new IllegalArgumentException(
                    "Ya existe un usuario registrado con ese correo."
            );
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.nombre().trim());
        usuario.setCorreo(correoNormalizado);
        // En la rama feature/seguridad reemplazaremos esto por BCryptPasswordEncoder
        usuario.setHashContrasena(request.contrasena());

        Usuario guardado = usuarioRepository.save(usuario);
        return UsuarioResponse.fromEntity(guardado);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<UsuarioResponse> buscarPorId(UUID id) {
        return usuarioRepository.findById(id)
                .map(UsuarioResponse::fromEntity);
    }
}