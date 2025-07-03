const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  let connection;
  
  try {
    console.log('🔗 Probando conexión básica...');
    
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      charset: 'utf8mb4',
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000
    };
    
    console.log(`📡 Conectando a: ${config.host}:${config.port}`);
    console.log(`🏢 Base de datos: ${config.database}`);
    console.log(`👤 Usuario: ${config.user}`);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión establecida correctamente');
    
    // Probar una consulta simple
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('✅ Consulta de prueba exitosa:', result);
    
    // Listar tablas existentes
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tablas existentes:', tables);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Código de error:', error.code);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

testConnection();
