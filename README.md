# API del Sistema de Inventario SUAN

API REST construida con Express.js y MySQL para el sistema de inventario SUAN.

## 🚀 Características

- **CRUD completo** para productos y movimientos kardex
- **Autenticación** y validación de datos
- **Rate limiting** para prevenir abuso
- **Manejo de errores** robusto
- **Documentación** de endpoints
- **Conexión segura** a MySQL
- **CORS** configurado para Flutter

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Copia `.env.example` a `.env` y configura las variables.

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Ejecutar en producción:
```bash
npm start
```

## 🗄️ Base de Datos

La API se conecta a MySQL usando las siguientes credenciales (configuradas en `.env`):

- **Servidor**: mysql1003.site4now.net
- **Base de datos**: db_abb3c4_sugay
- **Usuario**: abb3c4_sugay
- **Puerto**: 3306

## 📚 Endpoints

### Productos

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `GET /api/productos/codigo/:codigo` - Obtener producto por código
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `PUT /api/productos/stock/:codigo` - Actualizar stock
- `DELETE /api/productos/:id` - Eliminar producto

### Kardex

- `GET /api/kardex` - Obtener todos los movimientos
- `GET /api/kardex/:id` - Obtener movimiento por ID
- `GET /api/kardex/producto/:id_generado` - Movimientos por producto
- `GET /api/kardex/stats` - Estadísticas de movimientos
- `POST /api/kardex` - Crear nuevo movimiento
- `DELETE /api/kardex/:id` - Eliminar movimiento

### Sistema

- `GET /` - Información de la API
- `GET /health` - Estado de salud del sistema

## 🔧 Configuración

### Variables de Entorno

```env
# Base de datos
DB_HOST=mysql1003.site4now.net
DB_USER=abb3c4_sugay
DB_PASSWORD=suan2025
DB_NAME=db_abb3c4_sugay
DB_PORT=3306

# Servidor
PORT=3000
NODE_ENV=production

# CORS
ALLOWED_ORIGINS=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📱 Integración con Flutter

Para conectar la aplicación Flutter con esta API:

1. Cambiar las URLs en el código Flutter para apuntar a esta API
2. Reemplazar las llamadas directas a MySQL con llamadas HTTP
3. Manejar las respuestas JSON de la API

Ejemplo de URL base:
```dart
const String baseUrl = 'http://tu-servidor:3000/api';
```

## 🛡️ Seguridad

- **Helmet.js**: Headers de seguridad
- **Rate Limiting**: Límite de requests por IP
- **Validación**: Validación exhaustiva de datos
- **CORS**: Configuración de orígenes permitidos
- **Error Handling**: Manejo seguro de errores

## 📝 Validaciones

### Productos
- Tipo: 'ProductoTerminado' o 'MateriaPrima'
- Campos obligatorios: familia, clase, modelo, marca, etc.
- Longitudes máximas para cada campo
- Stock debe ser número positivo

### Movimientos Kardex
- Cantidad debe ser positiva
- Tipo: 'ENTRADA' o 'SALIDA'
- Fecha en formato ISO8601
- Referencias válidas a productos

## 🚨 Manejo de Errores

La API retorna respuestas estándar:

```json
{
  "success": true/false,
  "message": "Descripción del resultado",
  "data": {...}, // Solo en caso de éxito
  "error": "...", // Solo en caso de error
  "errors": [...] // Errores de validación
}
```

## 📊 Monitoreo

- Logs detallados de requests
- Health check endpoint
- Manejo de conexiones de BD
- Cierre graceful del servidor

## 🔄 Desarrollo

Para desarrollo local:

```bash
# Instalar nodemon globalmente
npm install -g nodemon

# Ejecutar en modo desarrollo
npm run dev
```

## 📦 Estructura del Proyecto

```
backend_api/
├── config/
│   └── database.js          # Configuración de MySQL
├── controllers/
│   ├── ProductoController.js # Lógica de productos
│   └── KardexController.js   # Lógica de kardex
├── middleware/
│   ├── validation.js         # Validaciones
│   └── errorHandler.js       # Manejo de errores
├── models/
│   ├── Producto.js           # Modelo de productos
│   └── MovimientoKardex.js   # Modelo de kardex
├── routes/
│   ├── productos.js          # Rutas de productos
│   └── kardex.js             # Rutas de kardex
├── .env                      # Variables de entorno
├── .gitignore               # Archivos ignorados
├── package.json             # Dependencias
├── server.js                # Servidor principal
└── README.md                # Documentación
```
