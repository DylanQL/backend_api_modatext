const { body, param, query, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para productos
const validateProducto = [
  body('tipo')
    .isIn(['ProductoTerminado', 'MateriaPrima'])
    .withMessage('Tipo debe ser ProductoTerminado o MateriaPrima'),
  
  body('familia')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Familia es requerida y debe tener máximo 100 caracteres'),
  
  body('clase')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Clase es requerida y debe tener máximo 100 caracteres'),
  
  body('modelo')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Modelo es requerido y debe tener máximo 100 caracteres'),
  
  body('marca')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Marca es requerida y debe tener máximo 100 caracteres'),
  
  body('presentacion')
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage('Presentación es requerida y debe tener máximo 100 caracteres'),
  
  body('color')
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage('Color es requerido y debe tener máximo 50 caracteres'),
  
  body('capacidad')
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage('Capacidad es requerida y debe tener máximo 50 caracteres'),
  
  body('unidad_venta')
    .notEmpty()
    .isLength({ min: 1, max: 50 })
    .withMessage('Unidad de venta es requerida y debe tener máximo 50 caracteres'),
  
  body('rack')
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage('Rack es requerido y debe tener máximo 20 caracteres'),
  
  body('nivel')
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage('Nivel es requerido y debe tener máximo 20 caracteres'),
  
  body('imagen')
    .optional()
    .isLength({ max: 500 })
    .withMessage('URL de imagen debe tener máximo 500 caracteres'),
  
  body('stock_actual')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock actual debe ser un número entero positivo'),
  
  handleValidationErrors
];

// Validaciones para actualización de stock
const validateStockUpdate = [
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('Cantidad debe ser un número entero positivo'),
  
  body('tipo_movimiento')
    .isIn(['ENTRADA', 'SALIDA'])
    .withMessage('Tipo de movimiento debe ser ENTRADA o SALIDA'),
  
  param('codigo')
    .notEmpty()
    .withMessage('Código numérico es requerido'),
  
  handleValidationErrors
];

// Validaciones para movimientos kardex
const validateMovimientoKardex = [
  body('producto')
    .notEmpty()
    .withMessage('ID del producto es requerido'),
  
  body('cantidad')
    .isInt({ min: 1 })
    .withMessage('Cantidad debe ser un número entero positivo'),
  
  body('tipo_movimiento')
    .isIn(['ENTRADA', 'SALIDA'])
    .withMessage('Tipo de movimiento debe ser ENTRADA o SALIDA'),
  
  body('rack')
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage('Rack es requerido y debe tener máximo 20 caracteres'),
  
  body('nivel')
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage('Nivel es requerido y debe tener máximo 20 caracteres'),
  
  body('stock_resultado')
    .isInt({ min: 0 })
    .withMessage('Stock resultado debe ser un número entero positivo'),
  
  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('Fecha debe estar en formato ISO8601'),
  
  handleValidationErrors
];

// Validaciones para parámetros de ID
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID debe ser un número entero positivo'),
  
  handleValidationErrors
];

// Validaciones para código numérico
const validateCode = [
  param('codigo')
    .notEmpty()
    .isLength({ min: 1, max: 20 })
    .withMessage('Código numérico es requerido y debe tener máximo 20 caracteres'),
  
  handleValidationErrors
];

// Validaciones para consultas con filtros
const validateQuery = [
  query('tipo')
    .optional()
    .isIn(['ProductoTerminado', 'MateriaPrima'])
    .withMessage('Tipo debe ser ProductoTerminado o MateriaPrima'),
  
  query('fecha_inicio')
    .optional()
    .isISO8601()
    .withMessage('Fecha de inicio debe estar en formato ISO8601'),
  
  query('fecha_fin')
    .optional()
    .isISO8601()
    .withMessage('Fecha de fin debe estar en formato ISO8601'),
  
  handleValidationErrors
];

module.exports = {
  validateProducto,
  validateStockUpdate,
  validateMovimientoKardex,
  validateId,
  validateCode,
  validateQuery,
  handleValidationErrors
};
