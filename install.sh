#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="/opt/genieacs-panel"
GENIEACS_DIR="/opt/genieacs"
LOG_DIR="/var/log/genieacs"
GENIEACS_USER="genieacs"
NODE_MAJOR="20"

export DEBIAN_FRONTEND=noninteractive

info() { echo "[INFO] $*"; }
warn() { echo "[WARN] $*"; }
fail() { echo "[ERROR] $*" >&2; exit 1; }

if [ "$(id -u)" -ne 0 ]; then
  fail "Run this script with sudo: sudo bash install.sh"
fi

if [ ! -d "$SCRIPT_DIR/backend" ] || [ ! -d "$SCRIPT_DIR/frontend" ]; then
  fail "This installer expects backend/ and frontend/ directories in the project root."
fi

info "Updating package lists"
apt-get update
apt-get install -y ca-certificates curl wget gnupg git ufw software-properties-common lsb-release

info "Installing Node.js ${NODE_MAJOR} from NodeSource"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_${NODE_MAJOR}.x | bash -
  apt-get install -y nodejs
else
  info "Node.js already installed: $(node -v)"
fi

info "Adding MongoDB 8.0 repository"
if ! grep -q "mongodb-org-8.0" /etc/apt/sources.list.d/mongodb-org-8.0.list 2>/dev/null; then
  curl -fsSL https://pgp.mongodb.com/server-8.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-8.0.gpg
  echo "deb [arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" > /etc/apt/sources.list.d/mongodb-org-8.0.list
fi
apt-get update
apt-get install -y mongodb-org

info "Creating GenieACS user and directories"
if ! id "$GENIEACS_USER" >/dev/null 2>&1; then
  useradd --system --home-dir "$GENIEACS_DIR" --create-home --shell /usr/sbin/nologin "$GENIEACS_USER" || true
fi
mkdir -p "$GENIEACS_DIR" "$LOG_DIR" /etc/genieacs
chown -R "$GENIEACS_USER:$GENIEACS_USER" "$GENIEACS_DIR" "$LOG_DIR" /etc/genieacs

info "Installing GenieACS"
npm install -g genieacs@1.2.13

info "Generating environment and secrets"
JWT_SECRET="$(openssl rand -base64 128 | tr -d '\n')"
SESSION_SECRET="$(openssl rand -base64 128 | tr -d '\n')"
cat > "$GENIEACS_DIR/genieacs.env" <<EOF
GENIEACS_CWMP_PORT=7547
GENIEACS_NBI_PORT=7557
GENIEACS_FS_PORT=7567
GENIEACS_UI_PORT=3000
GENIEACS_LOG_DIR=/var/log/genieacs
GENIEACS_MONGODB_CONNECTION_URL=mongodb://127.0.0.1:27017/genieacs
GENIEACS_JWT_SECRET=${JWT_SECRET}
GENIEACS_SESSION_SECRET=${SESSION_SECRET}
EOF
chmod 600 "$GENIEACS_DIR/genieacs.env"
chown "$GENIEACS_USER:$GENIEACS_USER" "$GENIEACS_DIR/genieacs.env"

info "Installing panel application into ${APP_DIR}"
rm -rf "$APP_DIR"
cp -a "$SCRIPT_DIR" "$APP_DIR"

info "Install backend dependencies"
cd "$APP_DIR/backend"
cp -f .env.example .env || true
sed -i "s#JWT_SECRET=.*#JWT_SECRET=${JWT_SECRET}#" .env || true
sed -i "s#SESSION_SECRET=.*#SESSION_SECRET=${SESSION_SECRET}#" .env || true
npm install --production=false

info "Build frontend"
cd "$APP_DIR/frontend"
cp -f .env.example .env || true
npm install
npm run build

info "Creating systemd service files"
mkdir -p /etc/systemd/system
install -m 0644 "$APP_DIR/systemd/genieacs-cwmp.service" /etc/systemd/system/genieacs-cwmp.service
install -m 0644 "$APP_DIR/systemd/genieacs-nbi.service" /etc/systemd/system/genieacs-nbi.service
install -m 0644 "$APP_DIR/systemd/genieacs-fs.service" /etc/systemd/system/genieacs-fs.service
install -m 0644 "$APP_DIR/systemd/genieacs-ui.service" /etc/systemd/system/genieacs-ui.service
install -m 0644 "$APP_DIR/systemd/genieacs-panel.service" /etc/systemd/system/genieacs-panel.service
systemctl daemon-reload

info "Configuring Nginx"
if ! command -v nginx >/dev/null 2>&1; then
  apt-get install -y nginx
fi
install -m 0644 "$APP_DIR/nginx/genieacs-panel.conf" /etc/nginx/conf.d/genieacs-panel.conf
if [ -f /etc/nginx/conf.d/default.conf ]; then
  rm -f /etc/nginx/conf.d/default.conf
fi
nginx -t
systemctl enable --now nginx

info "Enable services"
systemctl enable --now mongod
systemctl enable --now genieacs-cwmp genieacs-nbi genieacs-fs genieacs-ui genieacs-panel || true

info "Apply firewall rules"
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 7547/tcp
ufw --force enable || true

info "Installation complete"
info "Panel backend: http://127.0.0.1:5000"
info "GenieACS UI: http://127.0.0.1:3000"
info "Nginx HTTPS endpoint: https://your-domain"
info "Default admin credentials: admin / GenieACS@2025!"
