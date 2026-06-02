USE mundial2026;

CREATE TABLE campeon_usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,

    usuario_id INT NOT NULL,

    equipo_id INT NOT NULL,

    puntos INT DEFAULT 0,

    fecha_seleccion TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    FOREIGN KEY (equipo_id)
        REFERENCES equipos(id),

    UNIQUE(usuario_id)
);