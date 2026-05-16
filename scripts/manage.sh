#!/usr/bin/env bash
# =============================================================================
# manage.sh — Gerenciamento remoto do quick-stash
# Execute do seu Mac: bash scripts/manage.sh <comando>
#
# Comandos:
#   status    — Verifica serviço, versão atual, última release, uptime
#   deploy    — Força deploy manual
#   logs      — Mostra logs do auto-deploy
#   pm2-status  — Status do processo PM2
#   pm2-restart — Reinicia processo PM2
#   pm2-stop    — Para processo PM2
#   pm2-start   — Inicia processo PM2 manualmente
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

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC} $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC} $*"; }
error()   { echo -e "${RED}[ERROR]${NC} $*"; }
section() { echo -e "\n${BOLD}=== $* ===${NC}"; }

ssh_run() {
  ssh -i "$SERVER_KEY" -o StrictHostKeyChecking=accept-new \
      "${SERVER_USER}@${SERVER_IP}" "$@"
}

# ---------------------------------------------------------------------------
# status
# ---------------------------------------------------------------------------

cmd_status() {
  section "STATUS DO QUICK-STASH"

  # Versão atual deployada
  CURRENT_TAG=$(ssh_run "cat /var/www/quickstash/.deployed_version 2>/dev/null || echo 'N/A'")
  info "Versão atual: $CURRENT_TAG"

  # Última release no GitHub
  GH_REPO=$(ssh_run "cat /var/www/quickstash/.deploy_env 2>/dev/null | grep GH_REPO | cut -d= -f2")
  if [[ -n "$GH_REPO" ]]; then
    LATEST_JSON=$(curl -fsSL \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/repos/${GH_REPO}/releases?per_page=1" 2>/dev/null || echo "{}")
    LATEST_TAG=$(echo "$LATEST_JSON" | grep '"tag_name"' | head -1 | sed 's/.*"tag_name": *"\([^"]*\)".*/\1/' || echo "N/A")
    info "Última release: $LATEST_TAG"

    if [[ "$CURRENT_TAG" == "$LATEST_TAG" ]]; then
      info "Status: ATUALIZADO"
    elif [[ "$CURRENT_TAG" == "N/A" ]]; then
      warn "Status: NENHUM DEPLOY REALIZADO"
    else
      warn "Status: ATUALIZAÇÃO PENDENTE"
    fi
  fi

  # Status do PM2
  PM2_STATUS=$(ssh_run "pm2 list 2>/dev/null | grep quickstash || echo 'not found'")
  if echo "$PM2_STATUS" | grep -q "online"; then
    info "PM2: online"
  elif echo "$PM2_STATUS" | grep -q "erro"; then
    warn "PM2: com erro"
  else
    warn "PM2: não encontrado"
  fi

  # Uptime do Nginx
  NGINX_STATUS=$(ssh_run "systemctl is-active nginx 2>/dev/null || echo 'inactive'")
  if [[ "$NGINX_STATUS" == "active" ]]; then
    info "Nginx: ativo"
  else
    warn "Nginx: inativo"
  fi

  # Último log do deploy
  LAST_LOG=$(ssh_run "tail -3 /var/log/quickstash-deploy.log 2>/dev/null || echo 'Nenhum log encontrado'")
  echo ""
  echo -e "${CYAN}Últimos logs:${NC}"
  echo "$LAST_LOG" | sed 's/^/  /'
}

# ---------------------------------------------------------------------------
# deploy
# ---------------------------------------------------------------------------

cmd_deploy() {
  section "DEPLOY MANUAL"
  info "Forçando deploy manual..."
  ssh_run "/usr/local/bin/quickstash-auto-deploy.sh"
  info "Deploy concluído."
}

# ---------------------------------------------------------------------------
# logs
# ---------------------------------------------------------------------------

cmd_logs() {
  section "LOGS DO AUTO-DEPLOY"
  LOG_CONTENT=$(ssh_run "cat /var/log/quickstash-deploy.log 2>/dev/null" || echo "")
  if [[ -z "$LOG_CONTENT" ]]; then
    warn "Nenhum log encontrado. O arquivo de log só é preenchido quando o cron detecta uma nova release."
    warn "Deploys manuais (./manage.sh deploy) não escrevem no arquivo de log."
  else
    echo "$LOG_CONTENT" | tail -50
  fi
}

# ---------------------------------------------------------------------------
# pm2-status
# ---------------------------------------------------------------------------

cmd_pm2-status() {
  section "STATUS PM2"
  ssh_run "pm2 list"
}

# ---------------------------------------------------------------------------
# pm2-restart
# ---------------------------------------------------------------------------

cmd_pm2-restart() {
  section "REINICIAR PM2"
  info "Reiniciando processo quickstash..."
  ssh_run "pm2 restart quickstash"
  info "Reiniciado."
}

# ---------------------------------------------------------------------------
# pm2-reload
# ---------------------------------------------------------------------------

cmd_pm2-reload() {
  section "RELOAD PM2 (reinício completo)"
  info "Parando e reiniciando processo quickstash..."
  ssh_run "pm2 stop quickstash && pm2 delete quickstash"
  ssh_run "cd /var/www/quickstash && PORT=3001 pm2 start npm --name quickstash -- start"
  ssh_run "pm2 save"
  info "Reload concluído."
}

# ---------------------------------------------------------------------------
# pm2-stop
# ---------------------------------------------------------------------------

cmd_pm2-stop() {
  section "PARAR PM2"
  info "Parando processo quickstash..."
  ssh_run "pm2 stop quickstash"
  info "Parado."
}

# ---------------------------------------------------------------------------
# pm2-start
# ---------------------------------------------------------------------------

cmd_pm2-start() {
  section "INICIAR PM2"
  info "Iniciando processo quickstash..."
  ssh_run "cd /var/www/quickstash && PORT=3001 pm2 start npm --name quickstash -- start"
  ssh_run "pm2 save"
  info "Iniciado."
}

# ---------------------------------------------------------------------------
# pm2-logs
# ---------------------------------------------------------------------------

cmd_pm2-logs() {
  section "LOGS PM2"
  ssh_run "pm2 logs quickstash --lines 100"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

COMMAND="${1:-help}"

case "$COMMAND" in
  status)      cmd_status ;;
  deploy)      cmd_deploy ;;
  logs)        cmd_logs ;;
  pm2-status)  cmd_pm2-status ;;
  pm2-restart) cmd_pm2-restart ;;
  pm2-stop)    cmd_pm2-stop ;;
  pm2-start)   cmd_pm2-start ;;
  pm2-logs)    cmd_pm2-logs ;;
  pm2-reload)  cmd_pm2-reload ;;
  help|--help|-h)
    echo "Uso: $0 <comando>"
    echo ""
    echo "Comandos:"
    echo "  status      Verifica serviço, versão, uptime"
    echo "  deploy      Força deploy manual"
    echo "  logs        Mostra logs do auto-deploy"
    echo "  pm2-status  Status do processo PM2"
    echo "  pm2-restart Reinicia processo PM2"
    echo "  pm2-stop    Para processo PM2"
    echo "  pm2-start   Inicia processo PM2 manualmente"
    echo "  pm2-logs    Mostra logs do PM2"
    echo "  pm2-reload  Reinício completo (para, deleta e inicia com novo node)"
    ;;
  *)
    error "Comando desconhecido: $COMMAND"
    echo "Use '$0 help' para ver os comandos disponíveis."
    exit 1
    ;;
esac
