import urllib.request
import ssl
import re
from urllib.parse import urljoin

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

domains = [
    'https://legalzoo.in',
    'https://iqrawelfaretrust.in',
    'https://umazahcare.com',
    'https://officerecyclehub.com',
    'https://nobleheat.com'
]

for d in domains:
    try:
        req = urllib.request.Request(d, headers=headers)
        with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            favicons = re.findall(r'<link[^>]+rel=[\'"](?:shortcut icon|icon)[\'"][^>]+href=[\'"]([^\'"]+)[\'"]', html, re.I)
            if not favicons:
                favicons = re.findall(r'<link[^>]+href=[\'"]([^\'"]+)[\'"][^>]+rel=[\'"](?:shortcut icon|icon)[\'"]', html, re.I)
            images = re.findall(r'<img[^>]+src=[\'"]([^\'"]*(?:logo|brand|icon)[^\'"]*)[\'"]', html, re.I)
            print(f"=== {d} ===")
            print("Favicons:", [urljoin(d, f) for f in favicons[:3]])
            print("Logos:", [urljoin(d, img) for img in images[:4]])
    except Exception as e:
        print(f"=== {d} === ERROR: {e}")
