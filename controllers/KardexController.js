const MovimientoKardexModel = require('../models/MovimientoKardex');

class KardexController {
  // GET /api/kardex
  static async getAll(req, res, next) {
    try {
      const { tipo } = req.query;
      const movimientos = await MovimientoKardexModel.getAll(tipo);
      
      res.success(movimientos, `${movimientos.length} movimientos obtenidos correctamente`);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kardex/:id
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const movimiento = await MovimientoKardexModel.getById(id);
      
      if (!movimiento) {
        return res.error('Movimiento no encontrado', 404);
      }
      
      res.success(movimiento, 'Movimiento obtenido correctamente');
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kardex/producto/:id_generado
  static async getByProduct(req, res, next) {
    try {
      const { id_generado } = req.params;
      const movimientos = await MovimientoKardexModel.getByProduct(id_generado);
      
      res.success(movimientos, `${movimientos.length} movimientos del producto obtenidos correctamente`);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/kardex
  static async create(req, res, next) {
    try {
      const movimiento = await MovimientoKardexModel.create(req.body);
      
      res.success(movimiento, 'Movimiento creado correctamente', 201);
    } catch (error) {
      next(error);
    }
  }

  // GET /api/kardex/stats
  static async getStats(req, res, next) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const stats = await MovimientoKardexModel.getStats(fecha_inicio, fecha_fin);
      
      res.success(stats, 'Estadísticas obtenidas correctamente');
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/kardex/:id
  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      await MovimientoKardexModel.delete(id);
      
      res.success(null, 'Movimiento eliminado correctamente');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = KardexController;
