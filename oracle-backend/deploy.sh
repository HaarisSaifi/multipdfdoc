#!/bin/bash
# ==============================================================================
# MultiPDF Doc (multipdfdoc.com) - Oracle Cloud 24GB RAM Auto-Deployer
# Target OS: Ubuntu 22.04 / 24.04 LTS (Ampere A1 ARM64 or AMD64)
# ==============================================================================

set -e

echo "🚀 Starting MultiPDF Doc OCR Backend Deployment..."

# 1. Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get install -y \
    python3-pip \
    python3-venv \
    python3-dev \
    git \
    curl \
    nginx \
    certbot \
    python3-certbot-nginx \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    htop

# 2. Setup Application Directory
APP_DIR="/opt/multipdf-ocr"
echo "📁 Setting up application in ${APP_DIR}..."
sudo mkdir -p ${APP_DIR}
sudo chown -R $USER:$USER ${APP_DIR}

# Copy backend files
cp main.py ${APP_DIR}/
cp requirements.txt ${APP_DIR}/

# 3. Create Virtual Environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv ${APP_DIR}/venv
source ${APP_DIR}/venv/bin/activate

# Upgrade pip & install PyTorch
pip install --upgrade pip setuptools wheel
echo "🧠 Installing PaddleOCR and PyTorch requirements (this may take a few minutes)..."
pip install -r ${APP_DIR}/requirements.txt

# 4. Setup Systemd Service
echo "⚙️ Creating Systemd service for 24/7 background execution..."
sudo tee /etc/systemd/system/multipdf-ocr.service > /dev/null <<EOF
[Unit]
Description=MultiPDF Doc OCR Microservice
After=network.target

[Service]
User=$USER
WorkingDirectory=${APP_DIR}
ExecStart=${APP_DIR}/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5
Environment=PYTHONUNBUFFERED=1

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable multipdf-ocr
sudo systemctl restart multipdf-ocr

# 5. Setup Nginx Reverse Proxy
echo "🌐 Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/multipdf-ocr > /dev/null <<EOF
server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 120s;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/multipdf-ocr /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 6. Oracle Cloud Anti-Idle Reclamation Shield
echo "🛡️ Installing Oracle Free Tier Anti-Idle Keep-Alive Shield..."
sudo tee /usr/local/bin/oracle-anti-idle.sh > /dev/null <<'EOF'
#!/bin/bash
# Generates 20% CPU load for 45 seconds every 10 minutes to prevent Oracle Free Tier VM reclamation
timeout 45s sha256sum /dev/zero > /dev/null 2>&1 || true
EOF

sudo chmod +x /usr/local/bin/oracle-anti-idle.sh
# Add to crontab if not already present
(crontab -l 2>/dev/null | grep -v 'oracle-anti-idle'; echo "*/10 * * * * /usr/local/bin/oracle-anti-idle.sh > /dev/null 2>&1") | crontab -

echo "======================================================================"
echo "✅ MultiPDF Doc OCR Backend Deployment Completed Successfully!"
echo "📍 Service Status: sudo systemctl status multipdf-ocr"
echo "🔍 Live Healthcheck: curl http://localhost/health"
echo "======================================================================"
