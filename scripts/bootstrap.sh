#!/usr/bin/env bash
# =============================================================================
# bootstrap.sh — Configuração inicial do quick-stash no servidor Oracle Cloud
# Execute do seu Mac: bash scripts/bootstrap.sh
#
# Configuração (crie um arquivo .deploy.conf na raiz do projeto):
#   SERVER_IP=<ip do servidor>
#   SERVER_USER=<usuario ssh>
#   SERVER_KEY=<caminho da chave privada>   # opcional, default: ~/aptidev.key
# =============================================================================

set -euo pipefail

CONF_FILE="$(dirname "$0")/../.deploy.conf"
[[ -f "$CONF_FILE" ]] && source "$CONF_FILE"

SERVER_IP="${SERVER_IP:-}"
SERVER_USER="${SERVER_USER:-}"
SERVER_KEY="${SERVER_KEY:-$HOME/aptidev.key}"

[[ -n "$SERVER_IP" ]]   || { echo "Erro: SERVER_IP não definido. Crie o arquivo .deploy.conf"; exit 1; }
[[ -n "$SERVER_USER" ]] || { echo "Erro: SERVER_USER não definido. Crie o arquivo .deploy.conf"; exit 1; }

APP_DIR="/var/www/quickstash"
GH_REPO="flaviohbonfim/quick-stash-frontend"

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }
section() { echo -e "\n${BOLD}=== $* ===${NC}"; }

ssh_run() {
  ssh -i "$SERVER_KEY" -o StrictHostKeyChecking=accept-new \
      "${SERVER_USER}@${SERVER_IP}" "$@"
}

scp_upload() {
  scp -i "$SERVER_KEY" -o StrictHostKeyChecking=accept-new "$1" \
      "${SERVER_USER}@${SERVER_IP}:$2"
}

# ---------------------------------------------------------------------------
section "PRÉ-REQUISITOS"
# ---------------------------------------------------------------------------

[[ -f "$SERVER_KEY" ]] || error "Chave SSH não encontrada em $SERVER_KEY"

warn "Antes de continuar, certifique-se de que o DNS está configurado:"
warn "  Cloudflare → apti.dev → DNS → A record: quickstash → 150.136.215.43"
echo

# ---------------------------------------------------------------------------
section "TESTANDO CONEXÃO SSH"
# ---------------------------------------------------------------------------

info "Conectando ao servidor..."
ssh_run "echo 'SSH OK'"

# ---------------------------------------------------------------------------
section "VERIFICANDO PRÉ-REQUISITOS EXISTENTES"
# ---------------------------------------------------------------------------

info "Verificando se Nginx, Node.js e PM2 já estão instalados..."

NEEDS_NGINX=false
NEEDS_NODE=false
NEEDS_PM2=false

if ! ssh_run "command -v nginx" &>/dev/null; then
  NEEDS_NGINX=true
fi

if ! ssh_run "command -v node" &>/dev/null; then
  NEEDS_NODE=true
fi

if ! ssh_run "command -v pm2" &>/dev/null; then
  NEEDS_PM2=true
fi

if [[ "$NEEDS_NGINX" == "false" && "$NEEDS_NODE" == "false" && "$NEEDS_PM2" == "false" ]]; then
  info "Todos os pré-requisitos já estão instalados."
else
  info "Instalando pacotes ausentes..."

  if [[ "$NEEDS_NGINX" == "true" ]]; then
    info "Instalando Nginx..."
    ssh_run "sudo apt-get update -q && sudo apt-get install -y -q curl gnupg nginx"
  fi

  if [[ "$NEEDS_PM2" == "true" ]]; then
    info "Instalando PM2..."
    ssh_run "sudo npm install -g pm2"
  fi
fi

info "Garantindo Node.js 22 LTS..."
ssh_run "curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && \
         sudo apt-get install -y nodejs"

# ---------------------------------------------------------------------------
section "CERTIFICADO SSL"
# ---------------------------------------------------------------------------

info "Verificando certificado SSL existente..."
if ! ssh_run "test -f /etc/ssl/cloudflare/acertodev.cert"; then
  error "Certificado SSL não encontrado em /etc/ssl/cloudflare/acertodev.cert"
fi
info "Certificado SSL encontrado."

# ---------------------------------------------------------------------------
section "NGINX — ADICIONAR SERVER BLOCK"
# ---------------------------------------------------------------------------

info "Adicionando server block para quickstash.apti.dev ao Nginx..."

# Verifica se o server block já existe para evitar duplicação
if ssh_run "grep -q 'quickstash.apti.dev' /etc/nginx/sites-available/acertodev 2>/dev/null"; then
  warn "Server block para quickstash.apti.dev já existe no Nginx."
else
  ssh_run "sudo tee -a /etc/nginx/sites-available/acertodev > /dev/null << 'NGINX_EOF'

# quickstash.apti.dev
server {
    listen 80;
    server_name quickstash.apti.dev;
    return 301 https://\$host\$request_uri;
}

server {
    listen 443 ssl;
    server_name quickstash.apti.dev;

    ssl_certificate     /etc/ssl/cloudflare/acertodev.cert;
    ssl_certificate_key /etc/ssl/cloudflare/acertodev.key;

    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass         http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade \$http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host \$host;
        proxy_set_header   X-Real-IP \$remote_addr;
        proxy_set_header   X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX_EOF"

  ssh_run "sudo nginx -t && sudo systemctl reload nginx"
  info "Nginx atualizado com sucesso."
fi

# ---------------------------------------------------------------------------
section "VARIÁVEIS DE AMBIENTE DA APLICAÇÃO"
# ---------------------------------------------------------------------------

echo "Informe as variáveis de ambiente da aplicação:"
echo

read -rsp "  VITE_API_URL (ex: https://acertodev.apti.dev/api): " VITE_API_URL; echo
read -rsp "  BACKEND_URL (ex: https://acertodev.apti.dev/api): " BACKEND_URL; echo

[[ -n "$VITE_API_URL" ]] || error "VITE_API_URL não pode ser vazio."
[[ -n "$BACKEND_URL" ]]  || error "BACKEND_URL não pode ser vazio."

# ---------------------------------------------------------------------------
section "CONFIGURANDO DIRETÓRIO DA APLICAÇÃO"
# ---------------------------------------------------------------------------

info "Criando diretório da aplicação..."
ssh_run "sudo mkdir -p $APP_DIR && sudo chown ubuntu:ubuntu $APP_DIR"

info "Criando .env.local..."
ssh_run "cat > $APP_DIR/.env.local << EOF
VITE_API_URL=$VITE_API_URL
BACKEND_URL=$BACKEND_URL
NODE_ENV=production
EOF
chmod 600 $APP_DIR/.env.local"

# ---------------------------------------------------------------------------
section "AUTO-DEPLOY — CONFIGURAÇÃO"
# ---------------------------------------------------------------------------

info "Criando .deploy_env..."
ssh_run "cat > $APP_DIR/.deploy_env << EOF
GH_REPO=$GH_REPO
EOF
chmod 600 $APP_DIR/.deploy_env"

info "Instalando auto-deploy.sh no servidor..."
scp_upload "$(dirname "$0")/auto-deploy.sh" "/tmp/auto-deploy.sh"
ssh_run "sudo mv /tmp/auto-deploy.sh /usr/local/bin/quickstash-auto-deploy.sh && \
         sudo chmod +x /usr/local/bin/quickstash-auto-deploy.sh"

info "Registrando cron (a cada 5 minutos)..."
ssh_run "(crontab -l 2>/dev/null | grep -v quickstash-auto-deploy; \
          echo '*/5 * * * * /usr/local/bin/quickstash-auto-deploy.sh >> /var/log/quickstash-deploy.log 2>&1') | crontab -"

ssh_run "sudo touch /var/log/quickstash-deploy.log && \
         sudo chown ubuntu:ubuntu /var/log/quickstash-deploy.log"

# ---------------------------------------------------------------------------
section "PRIMEIRO DEPLOY"
# ---------------------------------------------------------------------------

info "Executando primeiro deploy (aguardando release no GitHub)..."
warn "O GitHub Actions precisa ter gerado ao menos uma release."
warn "Se ainda não fez push na main, faça agora e aguarde o Actions terminar."
echo
read -rp "Já existe uma release publicada no GitHub? [s/N] " has_release

if [[ "$has_release" =~ ^[sS]$ ]]; then
  ssh_run "/usr/local/bin/quickstash-auto-deploy.sh"
  info "Deploy concluído!"
else
  warn "Faça push na branch main para acionar o GitHub Actions."
  warn "Após a release ser criada, rode: ./manage.sh deploy"
fi

# ---------------------------------------------------------------------------
section "PM2 STARTUP"
# ---------------------------------------------------------------------------

info "Configurando PM2 para iniciar no boot..."
ssh_run "pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -1 | sudo bash || true"
ssh_run "pm2 save"

# ---------------------------------------------------------------------------
section "CONCLUÍDO"
# ---------------------------------------------------------------------------

echo
info "Bootstrap concluído com sucesso!"
info "Próximos passos:"
echo "  1. Faça push na branch main para acionar o GitHub Actions"
echo "  2. Adicione os secrets no GitHub:"
echo "     https://github.com/flaviohbonfim/quick-stash-frontend/settings/secrets/actions"
echo "     - VITE_API_URL: https://acertodev.apti.dev/api"
echo "     - BACKEND_URL: https://acertodev.apti.dev/api"
echo "  3. Use ./manage.sh status para verificar o servidor"
echo "  4. Acesse https://quickstash.apti.dev"
