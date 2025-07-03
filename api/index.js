const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Importar middleware personalizado (ruta relativa desde api/)
const { errorHandler, notFound, logger, responseHandler } = require('../middleware/errorHandler');

// Importar rutas (ruta relativa desde api/)
const productosRoutes = require('../routes/productos');
const kardexRoutes = require('../routes/kardex');

// Importar conexión a base de datos (ruta relativa desde api/)
const db = require('../config/database');

const app = express();

// Configuración de rate limiting (más permisivo para Vercel)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // máximo 200 requests por ventana (más permisivo)
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
    error: 'Rate limit exceeded'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: false, // Más permisivo para Vercel
}));

// Rate limiting
app.use(limiter);

// CORS - Más permisivo para producción
app.use(cors({
  origin: true, // Permitir todos los orígenes en Vercel
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware personalizado
app.use(logger);
app.use(responseHandler);

// Ruta de información de deployment
app.get('/deployment-info', (req, res) => {
  res.json({
    success: true,
    message: 'API desplegada en Vercel',
    timestamp: new Date().toISOString(),
    environment: 'production',
    version: '1.0.0',
    deployment: {
      platform: 'Vercel',
      region: process.env.VERCEL_REGION || 'unknown',
      url: process.env.VERCEL_URL || 'unknown'
    }
  });
});

// Ruta de salud
app.get('/health', async (req, res) => {
  try {
    // Verificar conexión a base de datos
    await db.query('SELECT 1');
    
    res.json({
      success: true,
      message: 'API funcionando correctamente en Vercel',
      timestamp: new Date().toISOString(),
      environment: 'production',
      version: '1.0.0',
      database: 'connected',
      deployment: {
        platform: 'Vercel',
        region: process.env.VERCEL_REGION || 'unknown'
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      error: error.message,
      deployment: {
        platform: 'Vercel',
        region: process.env.VERCEL_REGION || 'unknown'
      }
    });
  }
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API del Sistema de Inventario SUAN - Desplegada en Vercel',
    version: '1.0.0',
    deployment: {
      platform: 'Vercel',
      url: `https://${req.get('host')}`,
      timestamp: new Date().toISOString()
    },
    endpoints: {
      productos: '/api/productos',
      kardex: '/api/kardex',
      health: '/health',
      deploymentInfo: '/deployment-info'
    },
    documentation: {
      message: 'Endpoints disponibles',
      examples: {
        getAllProducts: `https://${req.get('host')}/api/productos`,
        getHealth: `https://${req.get('host')}/health`,
        getKardex: `https://${req.get('host')}/api/kardex`
      }
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

// Para Vercel, no necesitamos app.listen(), solo exportar la app
module.exports = app;
