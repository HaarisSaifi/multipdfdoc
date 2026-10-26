import urllib.request
import ssl

ctx = ssl.create_default_context()
headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request('https://multipdfdoc.com/', headers=headers)
with urllib.request.urlopen(req, timeout=10, context=ctx) as resp:
    html = resp.read().decode('utf-8', errors='ignore')
    print("Status:", resp.getcode())
    print("Has googletagmanager:", 'googletagmanager.com/gtag/js?id=G-K4KZYMTFBZ' in html)
    print("Has G-K4KZYMTFBZ:", 'G-K4KZYMTFBZ' in html)
