import os
import math
from PIL import Image, ImageDraw, ImageFont

public_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public")
os.makedirs(public_dir, exist_ok=True)

# 1. Create public/icon.svg
icon_svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="50%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#4F46E5"/>
    </linearGradient>
    <linearGradient id="doc-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>
    <linearGradient id="fold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#4C1D95" flood-opacity="0.25"/>
    </filter>
    <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0F172A" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Ambient Glow Squircle -->
  <rect x="32" y="32" width="448" height="448" rx="112" fill="url(#bg-grad)" filter="url(#shadow)"/>

  <!-- Inset Highlight Border -->
  <rect x="34" y="34" width="444" height="444" rx="110" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-opacity="0.4"/>

  <!-- Back Document Sheet (Slightly Angled / Offset) -->
  <rect x="176" y="112" width="190" height="240" rx="20" fill="#DDD6FE" opacity="0.75" transform="rotate(6 271 232)"/>

  <!-- Primary Foreground Document Sheet -->
  <g filter="url(#card-shadow)">
    <!-- Main Sheet Body -->
    <path d="M 148 128 L 300 128 L 364 192 L 364 372 C 364 385.2 353.2 396 340 396 L 148 396 C 134.8 396 124 385.2 124 372 L 124 152 C 124 138.8 134.8 128 148 128 Z" fill="url(#doc-grad)"/>
    
    <!-- Top-Right Corner Fold -->
    <path d="M 300 128 L 364 192 L 316 192 C 307.2 192 300 184.8 300 176 Z" fill="url(#fold-grad)"/>
    
    <!-- Document Text Lines -->
    <rect x="160" y="210" width="120" height="14" rx="7" fill="#7C3AED" opacity="0.85"/>
    <rect x="160" y="240" width="168" height="10" rx="5" fill="#94A3B8"/>
    <rect x="160" y="262" width="144" height="10" rx="5" fill="#94A3B8"/>
    <rect x="160" y="284" width="160" height="10" rx="5" fill="#94A3B8"/>
    <rect x="160" y="306" width="110" height="10" rx="5" fill="#94A3B8"/>
  </g>

  <!-- Security Shield Badge (Bottom Right of Document) -->
  <g transform="translate(300, 310)" filter="url(#card-shadow)">
    <circle cx="48" cy="48" r="44" fill="#FFFFFF"/>
    <circle cx="48" cy="48" r="38" fill="url(#shield-grad)"/>
    <!-- Checkmark / Lock Graphic -->
    <path d="M 36 48 L 44 56 L 62 38" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>'''

icon_path = os.path.join(public_dir, "icon.svg")
with open(icon_path, "w", encoding="utf-8") as f:
    f.write(icon_svg_content)
print(f"Created {icon_path}")

# 2. Helper to draw rounded rectangle with gradient
def draw_rounded_rect_gradient(img, xy, radius, color_start, color_end):
    draw = ImageDraw.Draw(img)
    x0, y0, x1, y1 = xy
    width = x1 - x0
    height = y1 - y0
    mask = Image.new("L", (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([0, 0, width, height], radius=radius, fill=255)

    grad = Image.new("RGBA", (width, height))
    grad_draw = ImageDraw.Draw(grad)
    for y in range(height):
        ratio = y / max(1, height - 1)
        r = int(color_start[0] + (color_end[0] - color_start[0]) * ratio)
        g = int(color_start[1] + (color_end[1] - color_start[1]) * ratio)
        b = int(color_start[2] + (color_end[2] - color_start[2]) * ratio)
        a = int(color_start[3] + (color_end[3] - color_start[3]) * ratio) if len(color_start) > 3 else 255
        grad_draw.line([(0, y), (width, y)], fill=(r, g, b, a))

    img.paste(grad, (x0, y0), mask)

# 3. Create public/apple-touch-icon.png (180x180)
ati_size = 180
ati_img = Image.new("RGBA", (ati_size, ati_size), (0, 0, 0, 0))
draw_rounded_rect_gradient(ati_img, (8, 8, 172, 172), radius=40, color_start=(139, 92, 246), color_end=(79, 70, 229))

ati_draw = ImageDraw.Draw(ati_img)
# Inset border
ati_draw.rounded_rectangle([9, 9, 171, 171], radius=39, outline=(255, 255, 255, 100), width=2)
# Back doc
ati_draw.rounded_rectangle([65, 42, 130, 125], radius=8, fill=(221, 214, 254, 180))
# Main doc
ati_draw.rounded_rectangle([48, 48, 122, 138], radius=8, fill=(255, 255, 255, 255))
# Fold
ati_draw.polygon([(102, 48), (122, 68), (102, 68)], fill=(203, 213, 225, 255))
# Lines
ati_draw.rounded_rectangle([60, 76, 105, 82], radius=3, fill=(124, 58, 237, 220))
ati_draw.rounded_rectangle([60, 90, 110, 94], radius=2, fill=(148, 163, 184, 255))
ati_draw.rounded_rectangle([60, 100, 102, 104], radius=2, fill=(148, 163, 184, 255))
ati_draw.rounded_rectangle([60, 110, 95, 114], radius=2, fill=(148, 163, 184, 255))
# Shield badge
ati_draw.ellipse([102, 106, 140, 144], fill=(255, 255, 255, 255))
ati_draw.ellipse([105, 109, 137, 141], fill=(16, 185, 129, 255))
ati_draw.line([(113, 124), (119, 130), (130, 118)], fill=(255, 255, 255, 255), width=3)

ati_path = os.path.join(public_dir, "apple-touch-icon.png")
ati_img.save(ati_path, "PNG")
print(f"Created {ati_path}")

# 4. Create public/favicon.ico
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = []
for s, _ in ico_sizes:
    resized = ati_img.resize((s, s), Image.Resampling.LANCZOS)
    ico_images.append(resized)

ico_path = os.path.join(public_dir, "favicon.ico")
ico_images[1].save(ico_path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[ico_images[0], ico_images[2]])
print(f"Created {ico_path}")

# 5. Create public/og-image.png (1200x630)
og_width, og_height = 1200, 630
og_img = Image.new("RGBA", (og_width, og_height), (248, 250, 252, 255))
og_draw = ImageDraw.Draw(og_img)

# Radial background gradient effect
for r in range(400, 0, -5):
    alpha = int(18 * (1 - r / 400))
    og_draw.ellipse([(150 - r, 150 - r), (150 + r, 150 + r)], fill=(124, 58, 237, alpha))
    og_draw.ellipse([(1050 - r, 480 - r), (1050 + r, 480 + r)], fill=(2, 132, 199, alpha))

# Border frame
og_draw.rectangle([0, 0, og_width - 1, og_height - 1], outline=(226, 232, 240, 255), width=2)

# Central tactile card container
card_x0, card_y0, card_x1, card_y1 = 60, 60, 1140, 570
og_draw.rounded_rectangle([card_x0, card_y0, card_x1, card_y1], radius=28, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=2)

# Paste brand badge (120x120)
brand_badge = ati_img.resize((100, 100), Image.Resampling.LANCZOS)
og_img.paste(brand_badge, (110, 105), brand_badge)

# Text rendering using default font
try:
    font_title = ImageFont.truetype("arialbd.ttf", 46)
    font_subtitle = ImageFont.truetype("arial.ttf", 24)
    font_badge = ImageFont.truetype("arialbd.ttf", 15)
    font_domain = ImageFont.truetype("arialbd.ttf", 20)
    font_pill = ImageFont.truetype("arialbd.ttf", 16)
except Exception:
    font_title = ImageFont.load_default()
    font_subtitle = ImageFont.load_default()
    font_badge = ImageFont.load_default()
    font_domain = ImageFont.load_default()
    font_pill = ImageFont.load_default()

# Header: Brand & Domain
og_draw.text((230, 115), "MultiPDF", fill=(15, 23, 42, 255), font=font_title)
og_draw.text((435, 115), "Doc", fill=(124, 58, 237, 255), font=font_title)
og_draw.text((232, 168), "multipdfdoc.com  •  100% In-Browser Document Suite", fill=(100, 116, 139, 255), font=font_domain)

# Main Value Headline
og_draw.text((110, 240), "Private In-Browser Document Suite", fill=(15, 23, 42, 255), font=font_title)
og_draw.text((110, 305), "Core document operations execute 100% locally in your browser memory.", fill=(71, 85, 105, 255), font=font_subtitle)
og_draw.text((110, 345), "Zero server document uploads  •  Zero tracking  •  100% Client-Side WebAssembly", fill=(100, 116, 139, 255), font=font_subtitle)

# Feature Badges Pill Row
pills = [
    ("100% Zero-Upload", (16, 185, 129), (236, 253, 245), (167, 243, 208)),
    ("QPDF WASM AES-256", (124, 58, 237), (245, 243, 255), (221, 214, 254)),
    ("Mozilla PDF.js 300 DPI", (2, 132, 199), (240, 249, 255), (186, 230, 253)),
    ("Tesseract Local OCR", (217, 119, 6), (255, 251, 235), (253, 230, 138)),
    ("IRS Pub 463 & Invoicing", (99, 102, 241), (238, 242, 255), (199, 210, 254)),
]

cur_x = 110
y_pill = 440
for text, text_col, bg_col, border_col in pills:
    bbox = font_pill.getbbox(text)
    pw = (bbox[2] - bbox[0]) + 28
    ph = 40
    og_draw.rounded_rectangle([cur_x, y_pill, cur_x + pw, y_pill + ph], radius=20, fill=bg_col, outline=border_col, width=1)
    og_draw.text((cur_x + 14, y_pill + 10), text, fill=text_col, font=font_pill)
    cur_x += pw + 16

# Footer trust bar
og_draw.line([(110, 520), (1090, 520)], fill=(226, 232, 240, 255), width=1)
og_draw.text((110, 532), "Open Source & Tested  •  HaarisSaifi/multipdfdoc", fill=(148, 163, 184, 255), font=font_badge)
og_draw.text((880, 532), "Verified WebAssembly Engine", fill=(16, 185, 129, 255), font=font_badge)

og_path = os.path.join(public_dir, "og-image.png")
og_img.save(og_path, "PNG")
print(f"Created {og_path}")
