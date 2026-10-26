import urllib.request
import ssl

ctx = ssl.create_default_context()
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

url = 'https://multipdfdoc.com/author/haaris-saifi'
req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15, context=ctx) as resp:
    code = resp.getcode()
    body = resp.read().decode('utf-8', errors='ignore')

expected = [
    'Jamia Hamdard',
    'B.Tech',
    'umazahcare.com',
    'legalzoo.svg',
    'umazah-favicon.svg',
    'iqra-logo.png',
    'officerecyclehub.png',
    'nobleheat.png',
    'images/author/haaris-saifi.jpg'
]

print(f"Status: {code}")
for token in expected:
    found = token in body
    print(f"Token '{token}': {found}")
