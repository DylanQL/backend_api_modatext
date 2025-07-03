const ProductoModel = require('../models/Producto');

class ProductoController {
  // GET /api/productos
  static async getAll(req, res, next) {
    try {
      const { tipo } = req.query;
      const productos = await ProductoModel.getAll(tipo);
      
      res.success(productos, `${productos.length} productos obtenidos correctamente`);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/productos/:id
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await ProductoModel.getById(id);
      
      if (!producto) {
        return res.error('Producto no encontrado', 404);
      }
      
      res.success(producto, 'Producto obtenido correctamente');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/productos/codigo/:codigo
  static async getByCode(req, res, next) {
    try {
      const { codigo } = req.params;
      const producto = await ProductoModel.getByCode(codigo);
      
      if (!producto) {
        return res.error('Producto no encontrado', 404);
      }
      
      res.success(producto, 'Producto obtenido correctamente');
    } catch (error) {
      next(error);
    }
  }

  // POST /api/productos
  static async create(req, res, next) {
    try {
      const producto = await ProductoModel.create(req.body);
      
      res.success(producto, 'Producto creado correctamente', 201);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/productos/:id
  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const producto = await ProductoModel.update(id, req.body);
      
      res.success(producto, 'Producto actualizado correctamente');
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/productos/:id
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await ProductoModel.delete(id);
      
      res.success(null, 'Producto eliminado correctamente');
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/productos/stock/:codigo
  static async updateStock(req, res, next) {
    try {
      const { codigo } = req.params;
      const { cantidad, tipo_movimiento } = req.body;
      
      const result = await ProductoModel.updateStock(codigo, cantidad, tipo_movimiento);
      
      res.success(result, 'Stock actualizado correctamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductoController;
