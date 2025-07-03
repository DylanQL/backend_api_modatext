# Deployment en Vercel

## 🚀 Configuración para Vercel

Este proyecto está configurado para desplegarse en Vercel con las siguientes características:

### Archivos de configuración:
- `vercel.json` - Configuración de deployment
- `api/index.js` - Punto de entrada para Vercel
- `.env.vercel` - Variables de entorno de ejemplo

### Variables de entorno requeridas en Vercel:

```
DB_HOST=mysql1003.site4now.net
DB_USER=abb3c4_sugay
DB_PASSWORD=suan2025
DB_NAME=db_abb3c4_sugay
DB_PORT=3306
NODE_ENV=production
ALLOWED_ORIGINS=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

## 📋 Pasos para desplegar:

### 1. Instalar Vercel CLI (si no lo tienes):
```bash
npm i -g vercel
```

### 2. Login en Vercel:
```bash
vercel login
```

### 3. Configurar el proyecto:
```bash
vercel
```

### 4. Configurar variables de entorno:
Ve al dashboard de Vercel → tu proyecto → Settings → Environment Variables
Agrega todas las variables listadas arriba.

### 5. Desplegar:
```bash
vercel --prod
```

## 🌐 URLs de prueba después del deployment:

- **Raíz**: `https://tu-proyecto.vercel.app/`
- **Health check**: `https://tu-proyecto.vercel.app/health`
- **Info de deployment**: `https://tu-proyecto.vercel.app/deployment-info`
- **Productos**: `https://tu-proyecto.vercel.app/api/productos`
- **Kardex**: `https://tu-proyecto.vercel.app/api/kardex`

## 🔧 Diferencias con desarrollo local:

1. **Punto de entrada**: `api/index.js` (en lugar de `server.js`)
2. **Sin app.listen()**: Vercel maneja el servidor
3. **CORS más permisivo**: Permite todos los orígenes
4. **Rate limiting ajustado**: Más permisivo para serverless
5. **Variables de entorno**: Configuradas en el dashboard de Vercel

## 🐛 Troubleshooting:

### Error 404:
- Verifica que `api/index.js` exista
- Revisa la configuración en `vercel.json`
- Asegúrate de que las rutas estén correctamente configuradas

### Error de base de datos:
- Verifica las variables de entorno en Vercel
- Confirma que la base de datos permita conexiones externas
- Revisa los logs en el dashboard de Vercel

### Error de CORS:
- Las variables `ALLOWED_ORIGINS=*` permiten cualquier origen
- Si necesitas mayor seguridad, especifica los dominios exactos
