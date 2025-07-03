const express = require('express');
const KardexController = require('../controllers/KardexController');
const { 
  validateMovimientoKardex, 
  validateId, 
  validateQuery 
} = require('../middleware/validation');

const router = express.Router();

// GET /api/kardex/stats - Obtener estadísticas (debe ir antes de /:id)
router.get('/stats', validateQuery, KardexController.getStats);

// GET /api/kardex - Obtener todos los movimientos
router.get('/', validateQuery, KardexController.getAll);

// GET /api/kardex/:id - Obtener movimiento por ID
router.get('/:id', validateId, KardexController.getById);

// GET /api/kardex/producto/:id_generado - Obtener movimientos por producto
router.get('/producto/:id_generado', KardexController.getByProduct);

// POST /api/kardex - Crear nuevo movimiento
router.post('/', validateMovimientoKardex, KardexController.create);

// DELETE /api/kardex/:id - Eliminar movimiento
router.delete('/:id', validateId, KardexController.delete);

module.exports = router;
