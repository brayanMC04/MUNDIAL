CREATE TABLE sincronizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,

    tipo VARCHAR(50),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,

    estado VARCHAR(20),

    mensaje TEXT
);