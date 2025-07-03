const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar middleware personalizado
const { errorHandler, notFound, logger, responseHandler } = require('./middleware/errorHandler');

// Importar rutas
const productosRoutes = require('./routes/productos');
const kardexRoutes = require('./routes/kardex');

// Importar conexión a base de datos
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet());

// Rate limiting
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS === '*' ? true : process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));

// Parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware personalizado
app.use(logger);
app.use(responseHandler);

// Ruta de salud
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await db.query('SELECT 1');
    
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: error.message
    });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema de Inventario SUAN',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      productos: '/api/productos',
      kardex: '/api/kardex',
      health: '/health'
    }
  });
});

// Rutas de la API
app.use('/api/productos', productosRoutes);
app.use('/api/kardex', kardexRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await db.connect();
    console.log('🗄️  Conexión a base de datos establecida');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await db.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await db.close();
  process.exit(0);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar el servidor
startServer();

module.exports = app;
