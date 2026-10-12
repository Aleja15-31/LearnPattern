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
@Table(name = "registros_habitos")
public class RegistroHabito {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private Short edad;

    @Column(length = 20)
    private String genero;

    @Column(name = "horas_estudio_dia", nullable = false, precision = 4, scale = 2)
    private BigDecimal horasEstudioDia;

    @Column(name = "horas_redes_sociales", nullable = false, precision = 4, scale = 2)
    private BigDecimal horasRedesSociales;

    @Column(name = "horas_netflix", nullable = false, precision = 4, scale = 2)
    private BigDecimal horasNetflix;

    @Column(name = "trabajo_medio_tiempo", nullable = false)
    private boolean trabajoMedioTiempo;

    @Column(name = "porcentaje_asistencia", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeAsistencia;

    @Column(name = "horas_sueno", nullable = false, precision = 4, scale = 2)
    private BigDecimal horasSueno;

    @Column(name = "calidad_alimentacion", nullable = false, length = 20)
    private String calidadAlimentacion;

    @Column(name = "frecuencia_ejercicio", nullable = false)
    private Short frecuenciaEjercicio;

    @Column(name = "nivel_educacion_padres", nullable = false, length = 50)
    private String nivelEducacionPadres;

    @Column(name = "calidad_internet", nullable = false, length = 20)
    private String calidadInternet;

    @Column(name = "valoracion_salud_mental", nullable = false)
    private Short valoracionSaludMental;

    @Column(name = "participa_extracurriculares", nullable = false)
    private boolean participaExtracurriculares;

    @Column(name = "fecha_creacion", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime fechaCreacion;

    public RegistroHabito() {
    }

    public UUID getId() {
        return id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Short getEdad() {
        return edad;
    }

    public void setEdad(Short edad) {
        this.edad = edad;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public BigDecimal getHorasEstudioDia() {
        return horasEstudioDia;
    }

    public void setHorasEstudioDia(BigDecimal horasEstudioDia) {
        this.horasEstudioDia = horasEstudioDia;
    }

    public BigDecimal getHorasRedesSociales() {
        return horasRedesSociales;
    }

    public void setHorasRedesSociales(BigDecimal horasRedesSociales) {
        this.horasRedesSociales = horasRedesSociales;
    }

    public BigDecimal getHorasNetflix() {
        return horasNetflix;
    }

    public void setHorasNetflix(BigDecimal horasNetflix) {
        this.horasNetflix = horasNetflix;
    }

    public boolean isTrabajoMedioTiempo() {
        return trabajoMedioTiempo;
    }

    public void setTrabajoMedioTiempo(boolean trabajoMedioTiempo) {
        this.trabajoMedioTiempo = trabajoMedioTiempo;
    }

    public BigDecimal getPorcentajeAsistencia() {
        return porcentajeAsistencia;
    }

    public void setPorcentajeAsistencia(BigDecimal porcentajeAsistencia) {
        this.porcentajeAsistencia = porcentajeAsistencia;
    }

    public BigDecimal getHorasSueno() {
        return horasSueno;
    }

    public void setHorasSueno(BigDecimal horasSueno) {
        this.horasSueno = horasSueno;
    }

    public String getCalidadAlimentacion() {
        return calidadAlimentacion;
    }

    public void setCalidadAlimentacion(String calidadAlimentacion) {
        this.calidadAlimentacion = calidadAlimentacion;
    }

    public Short getFrecuenciaEjercicio() {
        return frecuenciaEjercicio;
    }

    public void setFrecuenciaEjercicio(Short frecuenciaEjercicio) {
        this.frecuenciaEjercicio = frecuenciaEjercicio;
    }

    public String getNivelEducacionPadres() {
        return nivelEducacionPadres;
    }

    public void setNivelEducacionPadres(String nivelEducacionPadres) {
        this.nivelEducacionPadres = nivelEducacionPadres;
    }

    public String getCalidadInternet() {
        return calidadInternet;
    }

    public void setCalidadInternet(String calidadInternet) {
        this.calidadInternet = calidadInternet;
    }

    public Short getValoracionSaludMental() {
        return valoracionSaludMental;
    }

    public void setValoracionSaludMental(Short valoracionSaludMental) {
        this.valoracionSaludMental = valoracionSaludMental;
    }

    public boolean isParticipaExtracurriculares() {
        return participaExtracurriculares;
    }

    public void setParticipaExtracurriculares(boolean participaExtracurriculares) {
        this.participaExtracurriculares = participaExtracurriculares;
    }

    public OffsetDateTime getFechaCreacion() {
        return fechaCreacion;
    }
}