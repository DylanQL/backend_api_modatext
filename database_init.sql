-- Script de inicialización para la base de datos remota
-- Ejecutar en MySQL remoto

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_generado VARCHAR(50) UNIQUE NOT NULL,
    tipo ENUM('ProductoTerminado', 'MateriaPrima') NOT NULL,
    familia VARCHAR(100) NOT NULL,
    clase VARCHAR(100) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    presentacion VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    capacidad VARCHAR(50) NOT NULL,
    unidad_venta VARCHAR(50) NOT NULL,
    rack VARCHAR(20) NOT NULL,
    nivel VARCHAR(20) NOT NULL,
    codigo_numerico VARCHAR(20) UNIQUE NOT NULL,
    imagen VARCHAR(500),
    stock_actual INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tipo (tipo),
    INDEX idx_codigo_numerico (codigo_numerico),
    INDEX idx_id_generado (id_generado)
);

-- Tabla de movimientos kardex
CREATE TABLE IF NOT EXISTS movimientos_kardex (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    producto VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    tipo_movimiento ENUM('ENTRADA', 'SALIDA') NOT NULL,
    rack VARCHAR(20) NOT NULL,
    nivel VARCHAR(20) NOT NULL,
    stock_resultado INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto) REFERENCES productos(id_generado) ON DELETE CASCADE,
    INDEX idx_fecha (fecha),
    INDEX idx_producto (producto),
    INDEX idx_tipo_movimiento (tipo_movimiento)
);

-- Insertar algunos datos de ejemplo para pruebas
INSERT INTO productos (
    id_generado, tipo, familia, clase, modelo, marca, 
    presentacion, color, capacidad, unidad_venta, 
    rack, nivel, codigo_numerico, stock_actual
) VALUES 
(
    'PRELEMP3NAAPSI16G1', 
    'ProductoTerminado', 
    'Electronica', 
    'Audio', 
    'MP3', 
    'Nano', 
    'Apple', 
    'Slim', 
    'Silver', 
    '16GB', 
    'Unidad', 
    'A1', 
    '1', 
    '1000', 
    50
),
(
    'PRELEMP4SAAPCO32G1', 
    'ProductoTerminado', 
    'Electronica', 
    'Audio', 
    'MP4', 
    'Samsung', 
    'Apple', 
    'Compact', 
    'Black', 
    '32GB', 
    'Unidad', 
    'A2', 
    '2', 
    '1001', 
    25
),
(
    'MATEALCOPLMO11001', 
    'MateriaPrima', 
    'Metal', 
    'Aluminio', 
    'Plancha', 
    'Molina', 
    'Industrial', 
    'Natural', 
    '1mm', 
    'Metro', 
    'B1', 
    '1', 
    '2000', 
    100
);
