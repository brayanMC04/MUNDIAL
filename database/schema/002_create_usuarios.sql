USE mundial2026;

CREATE TABLE usuarios(
    id INT AUTO_INCREMENT PRIMARY KEY,

    cedula VARCHAR(20) UNIQUE NOT NULL,

    nombre VARCHAR(150) NOT NULL,

    area VARCHAR(100),

    password VARCHAR(255) NOT NULL,

    rol ENUM('admin','usuario')
    DEFAULT 'usuario',

    cambio_password BOOLEAN DEFAULT FALSE,

    fecha_creacion TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
);