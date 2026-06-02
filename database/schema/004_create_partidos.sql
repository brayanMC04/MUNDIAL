USE mundial2026;

CREATE TABLE partidos(
    id INT AUTO_INCREMENT PRIMARY KEY,

    api_id VARCHAR(100) NULL,

    fase VARCHAR(50) NOT NULL,

    equipo_local_id INT NULL,
    equipo_visitante_id INT NULL,

    fecha_partido DATETIME NOT NULL,

    fecha_cierre DATETIME NOT NULL,

    estadio VARCHAR(150) NULL,

    ciudad VARCHAR(100) NULL,

    goles_local INT DEFAULT NULL,

    goles_visitante INT DEFAULT NULL,

    estado ENUM(
        'pendiente',
        'en_curso',
        'finalizado'
    ) DEFAULT 'pendiente',

    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (equipo_local_id)
        REFERENCES equipos(id),

    FOREIGN KEY (equipo_visitante_id)
        REFERENCES equipos(id)
);