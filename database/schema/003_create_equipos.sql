USE mundial2026;

CREATE TABLE equipos(

    id INT AUTO_INCREMENT PRIMARY KEY,

    nombre VARCHAR(100) NOT NULL,

    codigo_fifa VARCHAR(3) UNIQUE NOT NULL,

    bandera_url VARCHAR(500),
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);