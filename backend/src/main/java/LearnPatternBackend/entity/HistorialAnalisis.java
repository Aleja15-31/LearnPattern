package LearnPatternBackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "historial_analisis")
public class HistorialAnalisis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "registro_habitos_id", nullable = false)
    private RegistroHabito registroHabito;

    @Column(name = "nombre_modelo", nullable = false, length = 100)
    private String nombreModelo;

    @Column(name = "nota_examen_estimada", precision = 5, scale = 2)
    private BigDecimal notaExamenEstimada;

    @Column(name = "nota_escala_5", precision = 3, scale = 2)
    private BigDecimal notaEscala5;

    @Column(name = "patron_aprendizaje", length = 100)
    private String patronAprendizaje;

    @Column(name = "resultado_json", columnDefinition = "TEXT")
    private String resultadoJson;

    @Column(name = "fecha_creacion", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime fechaCreacion;

    public HistorialAnalisis() {
    }

    public UUID getId() {
        return id;
    }

    public RegistroHabito getRegistroHabito() {
        return registroHabito;
    }

    public void setRegistroHabito(RegistroHabito registroHabito) {
        this.registroHabito = registroHabito;
    }

    public String getNombreModelo() {
        return nombreModelo;
    }

    public void setNombreModelo(String nombreModelo) {
        this.nombreModelo = nombreModelo;
    }

    public BigDecimal getNotaExamenEstimada() {
        return notaExamenEstimada;
    }

    public void setNotaExamenEstimada(BigDecimal notaExamenEstimada) {
        this.notaExamenEstimada = notaExamenEstimada;
    }

    public BigDecimal getNotaEscala5() {
        return notaEscala5;
    }

    public void setNotaEscala5(BigDecimal notaEscala5) {
        this.notaEscala5 = notaEscala5;
    }

    public String getPatronAprendizaje() {
        return patronAprendizaje;
    }

    public void setPatronAprendizaje(String patronAprendizaje) {
        this.patronAprendizaje = patronAprendizaje;
    }

    public String getResultadoJson() {
        return resultadoJson;
    }

    public void setResultadoJson(String resultadoJson) {
        this.resultadoJson = resultadoJson;
    }

    public OffsetDateTime getFechaCreacion() {
        return fechaCreacion;
    }
}