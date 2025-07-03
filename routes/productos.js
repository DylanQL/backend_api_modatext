const express = require('express');
const ProductoController = require('../controllers/ProductoController');
const { 
  validateProducto, 
  validateStockUpdate, 
  validateId, 
  validateCode, 
  validateQuery 
} = require('../middleware/validation');

const router = express.Router();

// GET /api/productos - Obtener todos los productos
router.get('/', validateQuery, ProductoController.getAll);

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', validateId, ProductoController.getById);

// GET /api/productos/codigo/:codigo - Obtener producto por código
router.get('/codigo/:codigo', validateCode, ProductoController.getByCode);

// POST /api/productos - Crear nuevo producto
router.post('/', validateProducto, ProductoController.create);

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', validateId, validateProducto, ProductoController.update);

// PUT /api/productos/stock/:codigo - Actualizar stock de producto
router.put('/stock/:codigo', validateStockUpdate, ProductoController.updateStock);

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', validateId, ProductoController.delete);

module.exports = router;
