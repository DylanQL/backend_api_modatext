#!/bin/bash

# Script para mostrar las IPs disponibles para acceder al servidor
echo "🌐 Direcciones IP disponibles para acceder al servidor:"
echo "=================================================="

# Obtener el puerto del archivo .env (por defecto 3000)
PORT=$(grep -E "^PORT=" .env 2>/dev/null | cut -d'=' -f2 || echo "3000")

echo "📍 Puerto configurado: $PORT"
echo ""

echo "🏠 Acceso local:"
echo "   http://localhost:$PORT"
echo "   http://127.0.0.1:$PORT"
echo ""

echo "🌐 Acceso desde la red:"
# Obtener todas las IPs disponibles (excluyendo loopback)
ip addr show | grep -E "inet [0-9]" | grep -v "127.0.0.1" | awk '{print $2}' | cut -d'/' -f1 | while read ip; do
    echo "   http://$ip:$PORT"
done

echo ""
echo "❤️  Health check endpoints:"
echo "   http://localhost:$PORT/health"
ip addr show | grep -E "inet [0-9]" | grep -v "127.0.0.1" | awk '{print $2}' | cut -d'/' -f1 | while read ip; do
    echo "   http://$ip:$PORT/health"
done

echo ""
echo "📋 Para usar desde Flutter o cualquier cliente:"
echo "   - Reemplaza 'localhost' con una de las IPs de red mostradas arriba"
echo "   - Asegúrate de que el firewall permita conexiones al puerto $PORT"
echo "   - En desarrollo, usa la IP de tu red local (192.168.x.x o 10.x.x.x)"
