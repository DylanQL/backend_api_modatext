const mysql = require('mysql2/promise');
require('dotenv').config();

async function addTipoMaterialField() {
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
    
    // Verificar si la columna ya existe
    console.log('\n🔍 Verificando si la columna tipo_material ya existe...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'productos' AND COLUMN_NAME = 'tipo_material'
    `, [config.database]);
    
    if (columns.length > 0) {
      console.log('⚠️ La columna tipo_material ya existe');
    } else {
      console.log('📋 Añadiendo columna tipo_material a la tabla productos...');
      
      await connection.execute(`
        ALTER TABLE productos 
        ADD COLUMN tipo_material VARCHAR(100) NULL 
        AFTER unidad_venta
      `);
      
      console.log('✅ Columna tipo_material añadida correctamente');
      
      // Actualizar datos existentes con valores por defecto
      console.log('📝 Actualizando productos existentes...');
      
      await connection.execute(`
        UPDATE productos 
        SET tipo_material = CASE 
          WHEN tipo = 'ProductoTerminado' THEN 'Electrónico'
          WHEN tipo = 'MateriaPrima' THEN 'Metal'
          ELSE 'Sin especificar'
        END
        WHERE tipo_material IS NULL
      `);
      
      console.log('✅ Productos existentes actualizados');
    }
    
    // Mostrar estructura actualizada
    console.log('\n📊 Estructura actual de la tabla productos:');
    const [tableStructure] = await connection.execute('DESCRIBE productos');
    tableStructure.forEach((col, index) => {
      console.log(`${index + 1}. ${col.Field} (${col.Type}) - ${col.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    console.log('\n🎉 ¡Modificación completada correctamente!');
    
  } catch (error) {
    console.error('❌ Error al modificar la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar la modificación
console.log('🚀 Iniciando modificación de base de datos...');
addTipoMaterialField();
