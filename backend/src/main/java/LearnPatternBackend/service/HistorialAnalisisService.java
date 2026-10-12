package LearnPatternBackend.service;

import LearnPatternBackend.entity.HistorialAnalisis;
import LearnPatternBackend.repository.HistorialAnalisisRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class HistorialAnalisisService {

    private final HistorialAnalisisRepository historialAnalisisRepository;

    public HistorialAnalisisService(
            HistorialAnalisisRepository historialAnalisisRepository) {
        this.historialAnalisisRepository = historialAnalisisRepository;
    }

    public HistorialAnalisis guardarAnalisis(HistorialAnalisis analisis) {
        return historialAnalisisRepository.save(analisis);
    }

    @Transactional(readOnly = true)
    public List<HistorialAnalisis> listarAnalisis() {
        return historialAnalisisRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<HistorialAnalisis> buscarPorId(UUID id) {
        return historialAnalisisRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<HistorialAnalisis> listarPorRegistroHabitos(UUID registroHabitosId) {
        return historialAnalisisRepository
                .findByRegistroHabitoId(registroHabitosId);
    }

    public void eliminarAnalisis(UUID id) {
        historialAnalisisRepository.deleteById(id);
    }
}