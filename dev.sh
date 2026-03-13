#!/bash
# =============================================================================
# Dev Script - Slidefly
# =============================================================================
# Este script detecta o IP da sua rede local (Windows) e inicia o Docker.
# Uso: ./dev.sh [flags do docker compose up]
# Exemplo: ./dev.sh --build -d
# =============================================================================
IP=$(ipconfig | grep -oE "\b(192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})\b" | head -n 1 | tr -d '\r ')
if [ -n "$IP" ]; then
    export HOST_IP=$IP
    echo -e "\033[0;32m✅ IP Detectado: $IP\033[0m"
else
    echo -e "\033[0;33m⚠️ IP Local não detectado.\033[0m"
fi
docker compose -f .docker/compose.yaml up "$@"
