package LearnPatternBackend.service;

import LearnPatternBackend.dto.AuthResponse;
import LearnPatternBackend.dto.LoginRequest;
import LearnPatternBackend.dto.UsuarioRequest;
import LearnPatternBackend.dto.UsuarioResponse;
import LearnPatternBackend.entity.Usuario;
import LearnPatternBackend.repository.UsuarioRepository;
import LearnPatternBackend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse registrar(UsuarioRequest request) {
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
        String token = jwtService.generateToken(guardado.getId(), guardado.getCorreo());
        return new AuthResponse(token, UsuarioResponse.fromEntity(guardado));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String correoNormalizado = request.correo().trim().toLowerCase();
        Usuario usuario = usuarioRepository.findByCorreo(correoNormalizado)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Correo o contrasena incorrectos."
                ));

        if (!passwordEncoder.matches(request.contrasena(), usuario.getHashContrasena())) {
            throw new IllegalArgumentException("Correo o contrasena incorrectos.");
        }

        String token = jwtService.generateToken(usuario.getId(), usuario.getCorreo());
        return new AuthResponse(token, UsuarioResponse.fromEntity(usuario));
    }

    @Transactional(readOnly = true)
    public Usuario obtenerEntidadPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Usuario autenticado no encontrado."));
    }

    @Transactional(readOnly = true)
    public UsuarioResponse obtenerUsuarioActual(String correo) {
        return UsuarioResponse.fromEntity(obtenerEntidadPorCorreo(correo));
    }
}