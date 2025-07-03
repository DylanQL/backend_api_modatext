const mysql = require('mysql2/promise');
require('dotenv').config();

async function simpleInit() {
  let connection;
  
  try {
    console.log('🔗 Conectando a la base de datos...');
    
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    };
    
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión establecida correctamente');
    
    // Verificar si ya existen datos
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM productos');
    const count = rows[0].count;
    
    if (count === 0) {
      console.log('📝 Insertando primer producto...');
      
      const insertQuery = `
        INSERT INTO productos (
          id_generado, tipo, familia, clase, modelo, marca, 
          presentacion, color, capacidad, unidad_venta, 
          rack, nivel, codigo_numerico, stock_actual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const values = [
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
        50
      ];
      
      console.log(`Columnas especificadas: 14`);
      console.log(`Valores proporcionados: ${values.length}`);
      console.log('Valores:', values);
      
      await connection.execute(insertQuery, values);
      
      console.log('✅ Primer producto insertado');
      
    } else {
      console.log(`⚠️ Ya existen ${count} productos en la base de datos`);
    }
    
    console.log('🎉 ¡Inicialización completada!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

simpleInit();
