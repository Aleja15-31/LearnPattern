package LearnPatternBackend.service;

import LearnPatternBackend.dto.RegistroHabitoRequest;
import LearnPatternBackend.dto.RegistroHabitoResponse;
import LearnPatternBackend.entity.RegistroHabito;
import LearnPatternBackend.entity.Usuario;
import LearnPatternBackend.repository.RegistroHabitoRepository;
import LearnPatternBackend.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RegistroHabitoService {

    private final RegistroHabitoRepository registroHabitoRepository;
    private final UsuarioRepository usuarioRepository;

    public RegistroHabitoService(
            RegistroHabitoRepository registroHabitoRepository,
            UsuarioRepository usuarioRepository) {
        this.registroHabitoRepository = registroHabitoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public RegistroHabito crearEntidad(RegistroHabitoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe un usuario con el id especificado."
                ));

        RegistroHabito registro = new RegistroHabito();
        registro.setUsuario(usuario);
        registro.setEdad(request.edad());
        registro.setGenero(request.genero());
        registro.setHorasEstudioDia(request.horasEstudioDia());
        registro.setHorasRedesSociales(request.horasRedesSociales());
        registro.setHorasNetflix(request.horasNetflix());
        registro.setTrabajoMedioTiempo(request.trabajoMedioTiempo());
        registro.setPorcentajeAsistencia(request.porcentajeAsistencia());
        registro.setHorasSueno(request.horasSueno());
        registro.setCalidadAlimentacion(request.calidadAlimentacion());
        registro.setFrecuenciaEjercicio(request.frecuenciaEjercicio());
        registro.setNivelEducacionPadres(request.nivelEducacionPadres());
        registro.setCalidadInternet(request.calidadInternet());
        registro.setValoracionSaludMental(request.valoracionSaludMental());
        registro.setParticipaExtracurriculares(request.participaExtracurriculares());

        return registroHabitoRepository.save(registro);
    }

    public RegistroHabitoResponse crearRegistro(RegistroHabitoRequest request) {
        return RegistroHabitoResponse.fromEntity(crearEntidad(request));
    }

    @Transactional(readOnly = true)
    public List<RegistroHabitoResponse> listarRegistros() {
        return registroHabitoRepository.findAll()
                .stream()
                .map(RegistroHabitoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<RegistroHabitoResponse> buscarPorId(UUID id) {
        return registroHabitoRepository.findById(id)
                .map(RegistroHabitoResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<RegistroHabitoResponse> listarPorUsuario(UUID usuarioId) {
        return registroHabitoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(RegistroHabitoResponse::fromEntity)
                .toList();
    }

    public void eliminarRegistro(UUID id) {
        registroHabitoRepository.deleteById(id);
    }
}