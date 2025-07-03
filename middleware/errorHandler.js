// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  // Error de validación de base de datos
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un registro con estos datos',
      error: 'Duplicate entry'
    });
  }

  // Error de conexión a base de datos
  if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: 'Database connection error'
    });
  }

  // Error de sintaxis SQL
  if (err.code && err.code.startsWith('ER_')) {
    return res.status(400).json({
      success: false,
      message: 'Error en la consulta de base de datos',
      error: 'Database query error'
    });
  }

  // Error personalizado
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message || 'Error del servidor',
      error: err.type || 'Custom error'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    error: 'Internal server error'
  });
};

// Middleware para rutas no encontradas
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
    error: 'Not found'
  });
};

// Middleware de logging
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
};

// Middleware para response estándar
const responseHandler = (req, res, next) => {
  res.success = (data, message = 'Operación exitosa', statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  res.error = (message = 'Error en la operación', statusCode = 500, error = null) => {
    res.status(statusCode).json({
      success: false,
      message,
      error
    });
  };

  next();
};

module.exports = {
  errorHandler,
  notFound,
  logger,
  responseHandler
};
