const db = require('../config/database');

class MovimientoKardexModel {
  // Obtener todos los movimientos
  static async getAll(tipoProducto = null) {
    try {
      let query = `
        SELECT mk.*, p.tipo as producto_tipo, p.familia, p.clase, p.modelo, p.marca
        FROM movimientos_kardex mk 
        JOIN productos p ON mk.producto = p.id_generado
      `;
      
      let params = [];
      
      if (tipoProducto) {
        query += ' WHERE p.tipo = ?';
        params.push(tipoProducto);
      }
      
      query += ' ORDER BY mk.fecha DESC';
      
      return await db.query(query, params);
    } catch (error) {
      throw new Error(`Error al obtener movimientos kardex: ${error.message}`);
    }
  }

  // Obtener movimientos por producto
  static async getByProduct(idGenerado) {
    try {
      const query = `
        SELECT mk.*, p.tipo as producto_tipo, p.familia, p.clase, p.modelo, p.marca
        FROM movimientos_kardex mk 
        JOIN productos p ON mk.producto = p.id_generado
        WHERE mk.producto = ?
        ORDER BY mk.fecha DESC
      `;
      
      return await db.query(query, [idGenerado]);
    } catch (error) {
      throw new Error(`Error al obtener movimientos del producto: ${error.message}`);
    }
  }

  // Obtener movimiento por ID
  static async getById(id) {
    try {
      const query = `
        SELECT mk.*, p.tipo as producto_tipo, p.familia, p.clase, p.modelo, p.marca
        FROM movimientos_kardex mk 
        JOIN productos p ON mk.producto = p.id_generado
        WHERE mk.id_movimiento = ?
      `;
      
      const results = await db.query(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener movimiento por ID: ${error.message}`);
    }
  }

  // Crear movimiento
  static async create(movimiento) {
    try {
      const query = `
        INSERT INTO movimientos_kardex (
          fecha, producto, cantidad, tipo_movimiento, 
          rack, nivel, stock_resultado
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        movimiento.fecha || new Date(),
        movimiento.producto,
        movimiento.cantidad,
        movimiento.tipo_movimiento,
        movimiento.rack,
        movimiento.nivel,
        movimiento.stock_resultado
      ];
      
      const result = await db.query(query, params);
      
      return {
        id_movimiento: result.insertId,
        ...movimiento
      };
    } catch (error) {
      throw new Error(`Error al crear movimiento kardex: ${error.message}`);
    }
  }

  // Obtener estadísticas de movimientos
  static async getStats(fechaInicio = null, fechaFin = null) {
    try {
      let whereClause = '';
      let params = [];
      
      if (fechaInicio && fechaFin) {
        whereClause = 'WHERE mk.fecha BETWEEN ? AND ?';
        params = [fechaInicio, fechaFin];
      }
      
      const entradas = await db.query(`
        SELECT COUNT(*) as total, COALESCE(SUM(cantidad), 0) as cantidad_total
        FROM movimientos_kardex mk
        ${whereClause} ${whereClause ? 'AND' : 'WHERE'} tipo_movimiento = 'ENTRADA'
      `, params);
      
      const salidas = await db.query(`
        SELECT COUNT(*) as total, COALESCE(SUM(cantidad), 0) as cantidad_total
        FROM movimientos_kardex mk
        ${whereClause} ${whereClause ? 'AND' : 'WHERE'} tipo_movimiento = 'SALIDA'
      `, params);
      
      const porTipo = await db.query(`
        SELECT p.tipo, mk.tipo_movimiento, COUNT(*) as total, COALESCE(SUM(mk.cantidad), 0) as cantidad_total
        FROM movimientos_kardex mk
        JOIN productos p ON mk.producto = p.id_generado
        ${whereClause}
        GROUP BY p.tipo, mk.tipo_movimiento
        ORDER BY p.tipo, mk.tipo_movimiento
      `, params);
      
      return {
        entradas: entradas[0],
        salidas: salidas[0],
        por_tipo: porTipo
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  // Eliminar movimiento
  static async delete(id) {
    try {
      const query = 'DELETE FROM movimientos_kardex WHERE id_movimiento = ?';
      const result = await db.query(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Movimiento no encontrado');
      }
      
      return { success: true, message: 'Movimiento eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar movimiento: ${error.message}`);
    }
  }
}

module.exports = MovimientoKardexModel;
