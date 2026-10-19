import os

base_dir = r'd:\adsense\src\app'
routes = []

for root, dirs, files in os.walk(base_dir):
    if 'page.tsx' in files:
        rel = os.path.relpath(root, base_dir).replace('\\', '/')
        route = '/' if rel == '.' else '/' + rel
        if not route.startswith('/api'):
            has_layout = 'layout.tsx' in files
            has_page = 'page.tsx' in files
            
            layout_content = ''
            if has_layout:
                with open(os.path.join(root, 'layout.tsx'), 'r', encoding='utf-8') as f:
                    layout_content = f.read()
            page_content = ''
            if has_page:
                with open(os.path.join(root, 'page.tsx'), 'r', encoding='utf-8') as f:
                    page_content = f.read()
            
            has_meta = ('export const metadata' in layout_content) or ('export const metadata' in page_content)
            has_canonical = ('canonical:' in layout_content) or ('canonical:' in page_content)
            has_jsonld = ('JsonLd' in layout_content) or ('JsonLd' in page_content) or ('application/ld+json' in layout_content) or ('application/ld+json' in page_content)
            has_val_wrap = '<ValueWrapper' in page_content
            
            routes.append({
                'route': route,
                'has_layout': has_layout,
                'has_meta': has_meta,
                'has_canonical': has_canonical,
                'has_jsonld': has_jsonld,
                'has_val_wrap': has_val_wrap
            })

print(f"Total routes found: {len(routes)}")
for r in sorted(routes, key=lambda x: x['route']):
    print(f"{r['route']:<55} | layout: {str(r['has_layout']):<5} | meta: {str(r['has_meta']):<5} | canon: {str(r['has_canonical']):<5} | jsonld: {str(r['has_jsonld']):<5} | val_wrap: {str(r['has_val_wrap']):<5}")
