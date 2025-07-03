const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const os = require('os');
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
const HOST = process.env.HOST || '0.0.0.0';

// Función para obtener las IPs de red
function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Saltar interfaces internas y IPv6
      if (interface.family === 'IPv4' && !interface.internal) {
        ips.push(interface.address);
      }
    }
  }
  
  return ips;
}

// Configuración de rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
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

// Ruta de información del servidor
app.get('/server-info', (req, res) => {
  const networkIPs = getNetworkIPs();
  res.json({
    success: true,
    message: 'Información del servidor',
    data: {
      host: HOST,
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      localAccess: [
        `http://localhost:${PORT}`,
        `http://127.0.0.1:${PORT}`
      ],
      networkAccess: networkIPs.map(ip => `http://${ip}:${PORT}`),
      endpoints: {
        productos: '/api/productos',
        kardex: '/api/kardex',
        health: '/health',
        serverInfo: '/server-info'
      }
    }
  });
});

// Ruta de salud
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      networkAccess: getNetworkIPs().map(ip => `http://${ip}:${PORT}`)
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
  const networkIPs = getNetworkIPs();
  res.json({
    success: true,
    message: 'API del Sistema de Inventario SUAN',
    version: '1.0.0',
    accessInfo: {
      local: `http://localhost:${PORT}`,
      network: networkIPs.map(ip => `http://${ip}:${PORT}`)
    },
    documentation: '/api-docs',
    endpoints: {
      productos: '/api/productos',
      kardex: '/api/kardex',
      health: '/health',
      serverInfo: '/server-info'
    }
  });
});

// Rutas de la API
app.use('/api/productos', productosRoutes);
app.use('/api/kardex', kardexRoutes);

// Middleware para rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores
app.use(errorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    await db.connect();
    console.log('🗄️  Conexión a base de datos establecida');
    
    app.listen(PORT, HOST, () => {
      console.log('\n🚀 ===== SERVIDOR INICIADO =====');
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Host: ${HOST}`);
      console.log(`🔌 Puerto: ${PORT}`);
      console.log('\n📍 Acceso Local:');
      console.log(`   http://localhost:${PORT}`);
      console.log(`   http://127.0.0.1:${PORT}`);
      
      const networkIPs = getNetworkIPs();
      if (networkIPs.length > 0) {
        console.log('\n🌐 Acceso desde la Red:');
        networkIPs.forEach(ip => {
          console.log(`   http://${ip}:${PORT}`);
        });
      }
      
      console.log('\n❤️  Endpoints de prueba:');
      console.log(`   http://localhost:${PORT}/health`);
      console.log(`   http://localhost:${PORT}/server-info`);
      
      console.log('\n📱 Para Flutter/Cliente móvil:');
      console.log('   Usa una de las IPs de red mostradas arriba');
      console.log('   Ejemplo: http://192.168.1.X:' + PORT);
      console.log('\n🔥 ¡Servidor listo para recibir conexiones desde cualquier IP!');
      console.log('=======================================\n');
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
