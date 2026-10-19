import ftplib
import os
import sys
import time
import secrets
import urllib.request
import json
import ssl

FTP_HOST = "82.25.120.193"
FTP_USER = "u379193775.multipdfdoc.com"
FTP_PASS = os.environ.get("FTP_PASS", "")
ZIP_PATH = r"d:\adsense\artifacts\multipdfdoc-hostinger.zip"

def main():
    if not os.path.exists(ZIP_PATH):
        print(f"ERROR: {ZIP_PATH} does not exist.")
        sys.exit(1)

    zip_size = os.path.getsize(ZIP_PATH)
    print(f"Found deployment package: {ZIP_PATH} ({zip_size / (1024*1024):.2f} MB)")

    token = secrets.token_hex(16)
    extractor_php = f"""<?php
if (!isset($_GET['token']) || $_GET['token'] !== '{token}') {{
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}}

header('Content-Type: application/json');

$zipFile = __DIR__ . '/deploy_bundle.zip';
if (!file_exists($zipFile)) {{
    echo json_encode(['error' => 'deploy_bundle.zip not found']);
    exit;
}}

$zip = new ZipArchive();
if ($zip->open($zipFile) !== true) {{
    echo json_encode(['error' => 'Failed to open zip']);
    exit;
}}

$extracted = 0;
for ($i = 0; $i < $zip->numFiles; $i++) {{
    $filename = $zip->getNameIndex($i);
    // Never overwrite google verification html if it exists in zip (it shouldn't be anyway)
    if (strpos($filename, 'google') === 0 && strpos($filename, '.html') !== false) {{
        continue;
    }}
    if ($zip->extractTo(__DIR__, array($filename))) {{
        $extracted++;
    }}
}}
$zip->close();

// Delete bundle zip
@unlink($zipFile);

// Self-destruct this extractor script
@unlink(__FILE__);

echo json_encode([
    'status' => 'success',
    'extracted_files' => $extracted,
    'timestamp' => time()
]);
"""

    print("Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    print("FTP Login successful. Directory:", ftp.pwd())

    # Check files in public_html
    file_list = ftp.nlst()
    print(f"Current server file count: {len(file_list)}")
    if 'googlec4493f5791f8eb92.html' in file_list:
        print("Confirmed Search Console verification file 'googlec4493f5791f8eb92.html' is present.")

    # Upload deploy_bundle.zip
    print(f"Uploading deployment bundle ({zip_size / (1024*1024):.2f} MB)...")
    start_time = time.time()
    uploaded_bytes = 0

    def progress_callback(block):
        nonlocal uploaded_bytes
        uploaded_bytes += len(block)
        pct = (uploaded_bytes / zip_size) * 100
        print(f"\rUpload progress: {pct:.1f}% ({uploaded_bytes / (1024*1024):.2f} MB / {zip_size / (1024*1024):.2f} MB)", end="", flush=True)

    with open(ZIP_PATH, "rb") as f:
        ftp.storbinary("STOR deploy_bundle.zip", f, blocksize=65536, callback=progress_callback)
    
    elapsed = time.time() - start_time
    print(f"\nUpload complete in {elapsed:.2f}s ({(zip_size / elapsed / 1024):.1f} KB/s)")

    # Upload extractor script
    print("Uploading extractor script...")
    import io
    ftp.storbinary("STOR deploy_extractor.php", io.BytesIO(extractor_php.encode('utf-8')))
    ftp.quit()
    print("FTP connection closed. Triggering server extraction...")

    # Call HTTPS extractor
    extract_url = f"https://multipdfdoc.com/deploy_extractor.php?token={token}"
    ctx = ssl.create_default_context()
    req = urllib.request.Request(extract_url, headers={"User-Agent": "MultiPDFDoc-Deployer/1.0"})
    
    try:
        with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
            data = resp.read().decode('utf-8')
            print("Extraction Response:", data)
            result = json.loads(data)
            if result.get("status") == "success":
                print(f"Successfully extracted {result.get('extracted_files')} files on Hostinger!")
            else:
                print("Unexpected response:", data)
    except Exception as e:
        print("Extraction request error:", e)

    # Double check that deploy_extractor.php and deploy_bundle.zip are cleaned up
    print("Verifying server cleanup...")
    ftp = ftplib.FTP(FTP_HOST, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    remaining_files = ftp.nlst()
    if 'deploy_bundle.zip' in remaining_files:
        print("Cleaning up leftover deploy_bundle.zip via FTP...")
        ftp.delete('deploy_bundle.zip')
    if 'deploy_extractor.php' in remaining_files:
        print("Cleaning up leftover deploy_extractor.php via FTP...")
        ftp.delete('deploy_extractor.php')
    print("Server files cleaned up. Current entries:", len(remaining_files))
    ftp.quit()

if __name__ == "__main__":
    main()
