package LearnPatternBackend.service;

import LearnPatternBackend.entity.RegistroHabito;
import LearnPatternBackend.repository.RegistroHabitoRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RegistroHabitoService {

    private final RegistroHabitoRepository registroHabitoRepository;

    public RegistroHabitoService(
            RegistroHabitoRepository registroHabitoRepository) {
        this.registroHabitoRepository = registroHabitoRepository;
    }

    public RegistroHabito crearRegistro(RegistroHabito registro) {
        if (registro.getFrecuenciaEjercicio() == null
                || registro.getFrecuenciaEjercicio() < 0
                || registro.getFrecuenciaEjercicio() > 7) {
            throw new IllegalArgumentException(
                    "La frecuencia de ejercicio debe estar entre 0 y 7."
            );
        }

        return registroHabitoRepository.save(registro);
    }

    @Transactional(readOnly = true)
    public List<RegistroHabito> listarRegistros() {
        return registroHabitoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<RegistroHabito> buscarPorId(UUID id) {
        return registroHabitoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<RegistroHabito> listarPorUsuario(UUID usuarioId) {
        return registroHabitoRepository.findByUsuarioId(usuarioId);
    }

    public void eliminarRegistro(UUID id) {
        registroHabitoRepository.deleteById(id);
    }
}