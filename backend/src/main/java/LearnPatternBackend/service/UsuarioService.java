package LearnPatternBackend.service;

import LearnPatternBackend.dto.UsuarioRequest;
import LearnPatternBackend.dto.UsuarioResponse;
import LearnPatternBackend.entity.Usuario;
import LearnPatternBackend.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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
        usuario.setHashContrasena(passwordEncoder.encode(request.contrasena()));

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