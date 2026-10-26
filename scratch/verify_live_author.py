import urllib.request
import ssl

ctx = ssl.create_default_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# 1. Image URL
img_url = 'https://multipdfdoc.com/images/author/haaris-saifi.jpg'
req = urllib.request.Request(img_url, headers=headers)
with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
    data = resp.read()
    print(f"IMAGE: {resp.getcode()} OK | Type: {resp.headers.get('Content-Type')} | Size: {len(data)} bytes")

# 2. Sitemap URL
sitemap_url = 'https://multipdfdoc.com/sitemap.xml'
req = urllib.request.Request(sitemap_url, headers=headers)
with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
    data = resp.read().decode('utf-8', errors='ignore')
    print(f"SITEMAP: {resp.getcode()} OK | Has haaris-saifi.jpg: {'haaris-saifi.jpg' in data}")

# 3. Author Page
author_url = 'https://multipdfdoc.com/author/haaris-saifi'
req = urllib.request.Request(author_url, headers=headers)
with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
    data = resp.read().decode('utf-8', errors='ignore')
    print(f"AUTHOR PAGE: {resp.getcode()} OK | Has Image in HTML: {'images/author/haaris-saifi.jpg' in data}")
