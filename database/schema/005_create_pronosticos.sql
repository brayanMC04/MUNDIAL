USE mundial2026;

CREATE TABLE pronosticos(
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    partido_id INT NOT NULL,

    pred_local INT NOT NULL,

    pred_visitante INT NOT NULL,

    puntos INT DEFAULT 0,

    calificado BOOLEAN DEFAULT FALSE,

    fecha_pronostico TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (partido_id)
        REFERENCES partidos(id)
        ON DELETE CASCADE,

    UNIQUE(usuario_id, partido_id)
);