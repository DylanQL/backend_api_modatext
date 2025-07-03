const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkTableStructure() {
  let connection;
  
  try {
    console.log('🔗 Conectando a la base de datos...');
    
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      charset: 'utf8mb4'
    };
    
    connection = await mysql.createConnection(config);
    console.log('✅ Conexión establecida correctamente');
    
    // Verificar estructura de la tabla productos
    console.log('\n📋 Estructura de la tabla productos:');
    const [columns] = await connection.execute('DESCRIBE productos');
    columns.forEach((col, index) => {
      console.log(`${index + 1}. ${col.Field} (${col.Type}) - ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log(`\n📊 Total de columnas: ${columns.length}`);
    
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

checkTableStructure();
