package LearnPatternBackend.repository;

import LearnPatternBackend.entity.HistorialAnalisis;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialAnalisisRepository
        extends JpaRepository<HistorialAnalisis, UUID> {

    List<HistorialAnalisis> findByRegistroHabitoId(UUID registroHabitosId);
}