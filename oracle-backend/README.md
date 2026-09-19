# ☁️ Oracle Cloud 24GB RAM OCR Microservice
### *MultiPDF Doc (`multipdfdoc.com`) Deep OCR & Handwriting Backend*

This microservice provides high-throughput, low-latency Optical Character Recognition (OCR) powered by **Baidu PaddleOCR** and **Microsoft TrOCR** on Oracle Cloud's Always Free Ampere A1 ARM64 instance (4 OCPUs, 24GB RAM).

---

## 📋 Prerequisites on Oracle Cloud

1. **Instance Specs:**
   - Image: Ubuntu 22.04 LTS or 24.04 LTS
   - Shape: `VM.Standard.A1.Flex` (4 OCPUs, 24 GB RAM)
   - Boot Volume: 100GB - 200GB NVMe

2. **Open Ingress Firewall Ports (Oracle Console):**
   In Oracle Cloud Console:
   - Go to: **Networking** -> **Virtual Cloud Networks** -> Click your VCN -> **Security Lists** -> **Default Security List**.
   - Add Ingress Rules:
     - **Port 80 (HTTP):** Source CIDR: `0.0.0.0/0`, IP Protocol: `TCP`, Destination Port Range: `80`
     - **Port 443 (HTTPS):** Source CIDR: `0.0.0.0/0`, IP Protocol: `TCP`, Destination Port Range: `443`

---

## 🚀 1-Command Deployment

Once connected to your Oracle VM via SSH:

```bash
# Clone the repository
git clone https://github.com/HaarisSaifi/multipdfdoc.git

# Navigate to backend directory
cd multipdfdoc/oracle-backend

# Make deploy script executable and run
chmod +x deploy.sh
./deploy.sh
```

The script will automatically:
1. Install Python 3, Nginx, Certbot, PyTorch, and PaddleOCR.
2. Configure Systemd service (`multipdf-ocr`) with automatic reboot recovery.
3. Configure Nginx reverse proxy on port 80.
4. Install the **Anti-Idle Cron Shield** so Oracle never reclaims or terminates your free instance.

---

## 🔗 Connect to MultiPDF Doc Frontend

In your Next.js environment (Vercel dashboard or `.env.local`):

```env
ORACLE_OCR_BACKEND_URL=http://YOUR_ORACLE_PUBLIC_IP
```

Now, every time a user requests **"AI Deep Scan / Handwriting Mode"** on `multipdfdoc.com/pdf/to-text`, the request will be processed by your private 24GB RAM Oracle server!

---

## 🔍 Verification & Health Check

```bash
# Check service status
sudo systemctl status multipdf-ocr

# Check API health
curl http://localhost/health
```
