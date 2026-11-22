CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(255) NOT NULL UNIQUE,
    hash_contrasena VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registros_habitos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    edad SMALLINT,
    genero VARCHAR(20),
    horas_estudio_dia NUMERIC(4,2) NOT NULL,
    horas_redes_sociales NUMERIC(4,2) NOT NULL,
    horas_netflix NUMERIC(4,2) NOT NULL,
    trabajo_medio_tiempo BOOLEAN NOT NULL,
    porcentaje_asistencia NUMERIC(5,2) NOT NULL,
    horas_sueno NUMERIC(4,2) NOT NULL,
    calidad_alimentacion VARCHAR(20) NOT NULL,
    frecuencia_ejercicio SMALLINT NOT NULL CHECK (frecuencia_ejercicio BETWEEN 0 AND 7),
    nivel_educacion_padres VARCHAR(50) NOT NULL,
    calidad_internet VARCHAR(20) NOT NULL,
    valoracion_salud_mental SMALLINT NOT NULL CHECK (valoracion_salud_mental BETWEEN 1 AND 10),
    participa_extracurriculares BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS historial_analisis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registro_habitos_id UUID NOT NULL REFERENCES registros_habitos(id) ON DELETE CASCADE,
    nombre_modelo VARCHAR(100) NOT NULL,
    nota_examen_estimada NUMERIC(5,2),
    nota_escala_5 NUMERIC(3,2),
    patron_aprendizaje VARCHAR(100),
    resultado_json TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);