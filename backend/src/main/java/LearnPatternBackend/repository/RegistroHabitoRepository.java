package LearnPatternBackend.repository;

import LearnPatternBackend.entity.RegistroHabito;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroHabitoRepository
        extends JpaRepository<RegistroHabito, UUID> {

    List<RegistroHabito> findByUsuarioId(UUID usuarioId);
}