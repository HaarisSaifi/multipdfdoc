import os
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

out_dir = r"d:\adsense\public\images\portfolio"
os.makedirs(out_dir, exist_ok=True)

targets = {
    "legalzoo.svg": "https://legalzoo.in/static/favicon.svg",
    "iqra-logo.png": "https://iqrawelfaretrust.in/logo.png",
    "umazah-logo.webp": "https://umazahcare.com/assets/logo.webp",
    "umazah-favicon.svg": "https://umazahcare.com/assets/favicon.svg",
    "officerecyclehub.png": "https://officerecyclehub.com/wp-content/uploads/2026/01/cropped-off-192x192.png",
    "nobleheat.png": "https://nobleheat.com/wp-content/uploads/2025/05/android-chrome-512x512-2-150x150.png",
}

for name, url in targets.items():
    file_path = os.path.join(out_dir, name)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
            content = resp.read()
            with open(file_path, "wb") as f:
                f.write(content)
            print(f"Downloaded {name}: {len(content)} bytes from {url}")
    except Exception as e:
        print(f"Failed {name} ({url}): {e}")
