const mysql = require('mysql2/promise');
require('dotenv').config();

class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
      charset: 'utf8mb4'
    };
  }

  async connect() {
    try {
      this.pool = mysql.createPool(this.config);
      
      // Probar la conexión
      const connection = await this.pool.getConnection();
      console.log('✅ Conexión a MySQL establecida correctamente');
      connection.release();
      
      return this.pool;
    } catch (error) {
      console.error('❌ Error al conectar con MySQL:', error.message);
      throw error;
    }
  }

  async query(sql, params = []) {
    try {
      if (!this.pool) {
        await this.connect();
      }
      
      const [results] = await this.pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error('Error en query:', error.message);
      throw error;
    }
  }

  async transaction(callback) {
    const connection = await this.pool.getConnection();
    
    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      console.log('Conexión a MySQL cerrada');
    }
  }
}

module.exports = new DatabaseConnection();
