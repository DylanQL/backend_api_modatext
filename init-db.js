const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  
  try {
    console.log('🔗 Conectando a la base de datos...');
    
    // Configuración de conexión
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      charset: 'utf8mb4'
    };
    
    console.log(`📡 Conectando a: ${config.host}:${config.port}`);
    console.log(`🏢 Base de datos: ${config.database}`);
    console.log(`👤 Usuario: ${config.user}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión establecida correctamente');
    
    // Crear tabla de productos
    console.log('\n📋 Creando tabla de productos...');
    await connection.execute(`
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
          tipo_material VARCHAR(100),
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
      )
    `);
    console.log('✅ Tabla productos creada');
    
    // Crear tabla de movimientos kardex
    console.log('\n📋 Creando tabla de movimientos kardex...');
    await connection.execute(`
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
      )
    `);
    console.log('✅ Tabla movimientos_kardex creada');
    
    // Verificar si ya existen datos
    console.log('\n🔍 Verificando datos existentes...');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM productos');
    const count = rows[0].count;
    
    if (count === 0) {
      console.log('📝 Insertando datos de ejemplo...');
      
      // Insertar productos de ejemplo
      await connection.execute(`
        INSERT INTO productos (
          id_generado, tipo, familia, clase, modelo, marca, 
          presentacion, color, capacidad, unidad_venta, tipo_material,
          rack, nivel, codigo_numerico, stock_actual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
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
        'Electrónico',
        'Unidad', 
        'A1', 
        '1', 
        '1000',
        50
      ]);
      
      await connection.execute(`
        INSERT INTO productos (
          id_generado, tipo, familia, clase, modelo, marca, 
          presentacion, color, capacidad, unidad_venta, tipo_material,
          rack, nivel, codigo_numerico, stock_actual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
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
        'Plástico',
        'Unidad', 
        'A2', 
        '2', 
        '1001',
        25
      ]);
      
      await connection.execute(`
        INSERT INTO productos (
          id_generado, tipo, familia, clase, modelo, marca, 
          presentacion, color, capacidad, unidad_venta, tipo_material,
          rack, nivel, codigo_numerico, stock_actual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
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
        'Aleación de Aluminio',
        'B1', 
        '1', 
        '2000',
        100
      ]);
      
      // Insertar movimientos de ejemplo
      await connection.execute(`
        INSERT INTO movimientos_kardex (
          fecha, producto, cantidad, tipo_movimiento, 
          rack, nivel, stock_resultado
        ) VALUES 
        (
          NOW(), 
          'PRELEMP3NAAPSI16G1', 
          50, 
          'ENTRADA', 
          'A1', 
          '1', 
          50
        ),
        (
          NOW(), 
          'PRELEMP4SAAPCO32G1', 
          30, 
          'ENTRADA', 
          'A2', 
          '2', 
          30
        ),
        (
          DATE_SUB(NOW(), INTERVAL 1 HOUR), 
          'PRELEMP4SAAPCO32G1', 
          5, 
          'SALIDA', 
          'A2', 
          '2', 
          25
        ),
        (
          NOW(), 
          'MATEALCOPLMO11001', 
          100, 
          'ENTRADA', 
          'B1', 
          '1', 
          100
        )
      `);
      
      console.log('✅ Datos de ejemplo insertados');
    } else {
      console.log(`⚠️ Ya existen ${count} productos en la base de datos`);
    }
    
    // Mostrar resumen
    console.log('\n📊 === RESUMEN ===');
    const [productCount] = await connection.execute('SELECT COUNT(*) as count FROM productos');
    const [movCount] = await connection.execute('SELECT COUNT(*) as count FROM movimientos_kardex');
    
    console.log(`📦 Productos: ${productCount[0].count}`);
    console.log(`📋 Movimientos: ${movCount[0].count}`);
    
    // Mostrar productos por tipo
    const [typeStats] = await connection.execute(`
      SELECT tipo, COUNT(*) as cantidad 
      FROM productos 
      GROUP BY tipo
    `);
    
    console.log('\n📈 Productos por tipo:');
    typeStats.forEach(stat => {
      console.log(`  ${stat.tipo}: ${stat.cantidad}`);
    });
    
    console.log('\n🎉 ¡Base de datos inicializada correctamente!');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🌐 Error de conectividad: No se puede resolver el hostname');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔐 Error de acceso: Credenciales incorrectas');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Error de conexión: Conexión rechazada');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la inicialización
console.log('🚀 Iniciando configuración de base de datos...');
initializeDatabase();
