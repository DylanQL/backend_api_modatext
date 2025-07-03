const db = require('../config/database');

class ProductoModel {
  // Obtener todos los productos
  static async getAll(tipo = null) {
    try {
      let query = 'SELECT * FROM productos';
      let params = [];
      
      if (tipo) {
        query += ' WHERE tipo = ?';
        params.push(tipo);
      }
      
      query += ' ORDER BY created_at DESC';
      
      return await db.query(query, params);
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  // Obtener producto por código numérico
  static async getByCode(codigoNumerico) {
    try {
      const query = 'SELECT * FROM productos WHERE codigo_numerico = ?';
      const results = await db.query(query, [codigoNumerico]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener producto por código: ${error.message}`);
    }
  }

  // Obtener producto por ID
  static async getById(id) {
    try {
      const query = 'SELECT * FROM productos WHERE id = ?';
      const results = await db.query(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw new Error(`Error al obtener producto por ID: ${error.message}`);
    }
  }

  // Crear producto
  static async create(producto) {
    try {
      // Generar código numérico único
      const codigoNumerico = await this.generateUniqueCode();
      
      // Generar ID del producto
      const idGenerado = this.generateProductId(producto);
      
      const query = `
        INSERT INTO productos (
          id_generado, tipo, familia, clase, modelo, marca, 
          presentacion, color, capacidad, unidad_venta, 
          rack, nivel, codigo_numerico, imagen, stock_actual
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        idGenerado,
        producto.tipo,
        producto.familia,
        producto.clase,
        producto.modelo,
        producto.marca,
        producto.presentacion,
        producto.color,
        producto.capacidad,
        producto.unidad_venta,
        producto.rack,
        producto.nivel,
        codigoNumerico,
        producto.imagen || null,
        producto.stock_actual || 0
      ];
      
      const result = await db.query(query, params);
      
      return {
        id: result.insertId,
        id_generado: idGenerado,
        codigo_numerico: codigoNumerico,
        ...producto
      };
    } catch (error) {
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  // Actualizar producto
  static async update(id, producto) {
    try {
      const query = `
        UPDATE productos 
        SET tipo = ?, familia = ?, clase = ?, modelo = ?, marca = ?,
            presentacion = ?, color = ?, capacidad = ?, unidad_venta = ?,
            rack = ?, nivel = ?, imagen = ?, stock_actual = ?
        WHERE id = ?
      `;
      
      const params = [
        producto.tipo,
        producto.familia,
        producto.clase,
        producto.modelo,
        producto.marca,
        producto.presentacion,
        producto.color,
        producto.capacidad,
        producto.unidad_venta,
        producto.rack,
        producto.nivel,
        producto.imagen,
        producto.stock_actual,
        id
      ];
      
      const result = await db.query(query, params);
      
      if (result.affectedRows === 0) {
        throw new Error('Producto no encontrado');
      }
      
      return await this.getById(id);
    } catch (error) {
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  // Eliminar producto
  static async delete(id) {
    try {
      const query = 'DELETE FROM productos WHERE id = ?';
      const result = await db.query(query, [id]);
      
      if (result.affectedRows === 0) {
        throw new Error('Producto no encontrado');
      }
      
      return { success: true, message: 'Producto eliminado correctamente' };
    } catch (error) {
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  // Actualizar stock
  static async updateStock(codigoNumerico, cantidad, tipoMovimiento) {
    try {
      return await db.transaction(async (connection) => {
        // Obtener producto actual
        const [productos] = await connection.execute(
          'SELECT * FROM productos WHERE codigo_numerico = ?',
          [codigoNumerico]
        );
        
        if (productos.length === 0) {
          throw new Error('Producto no encontrado');
        }
        
        const producto = productos[0];
        const stockAnterior = producto.stock_actual;
        let stockNuevo;
        
        if (tipoMovimiento === 'ENTRADA') {
          stockNuevo = stockAnterior + cantidad;
        } else {
          stockNuevo = stockAnterior - cantidad;
          if (stockNuevo < 0) {
            throw new Error('Stock insuficiente');
          }
        }
        
        // Actualizar stock
        await connection.execute(
          'UPDATE productos SET stock_actual = ? WHERE codigo_numerico = ?',
          [stockNuevo, codigoNumerico]
        );
        
        // Insertar movimiento kardex
        await connection.execute(`
          INSERT INTO movimientos_kardex (
            fecha, producto, cantidad, tipo_movimiento, 
            rack, nivel, stock_resultado
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          new Date(),
          producto.id_generado,
          cantidad,
          tipoMovimiento,
          producto.rack,
          producto.nivel,
          stockNuevo
        ]);
        
        return {
          producto: producto.id_generado,
          stock_anterior: stockAnterior,
          stock_nuevo: stockNuevo,
          cantidad,
          tipo_movimiento: tipoMovimiento
        };
      });
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  // Generar código numérico único
  static async generateUniqueCode() {
    let codigo = 1000;
    let existe = true;
    
    while (existe && codigo <= 9999) {
      const results = await db.query(
        'SELECT COUNT(*) as count FROM productos WHERE codigo_numerico = ?',
        [codigo.toString()]
      );
      
      if (results[0].count === 0) {
        existe = false;
      } else {
        codigo++;
      }
    }
    
    if (codigo > 9999) {
      throw new Error('No hay códigos numéricos disponibles');
    }
    
    return codigo.toString();
  }

  // Generar ID del producto
  static generateProductId(producto) {
    const getPrimera = (str) => str.charAt(0).toUpperCase();
    
    return [
      getPrimera(producto.tipo),
      getPrimera(producto.familia),
      getPrimera(producto.clase),
      getPrimera(producto.modelo),
      getPrimera(producto.marca),
      getPrimera(producto.presentacion),
      getPrimera(producto.color),
      getPrimera(producto.capacidad),
      getPrimera(producto.unidad_venta),
      '1' // secuencial por defecto
    ].join('');
  }
}

module.exports = ProductoModel;
