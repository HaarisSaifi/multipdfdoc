import os
import zipfile
import xml.etree.ElementTree as ET

def get_sheet_data(file_path):
    result = {}
    with zipfile.ZipFile(file_path, 'r') as z:
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in ss_tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text_parts = [t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text]
                shared_strings.append(''.join(text_parts))
        
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheets = [s.attrib['name'] for s in wb_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet')]
        
        sheet_idx = 1
        for sheet_name in sheets:
            sheet_file = f'xl/worksheets/sheet{sheet_idx}.xml'
            if sheet_file not in z.namelist():
                sheet_idx += 1
                continue
            s_tree = ET.fromstring(z.read(sheet_file))
            rows = []
            for row in s_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row'):
                row_vals = []
                for c in row.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    val = ""
                    t_attr = c.attrib.get('t', '')
                    v_tag = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    if v_tag is not None and v_tag.text is not None:
                        val = v_tag.text
                        if t_attr == 's':
                            idx = int(val)
                            val = shared_strings[idx] if idx < len(shared_strings) else val
                    elif c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') is not None:
                        val = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}is/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t').text or ""
                    row_vals.append(val)
                if any(row_vals):
                    rows.append(row_vals)
            result[sheet_name] = rows
            sheet_idx += 1
    return result

sc_dir = r"d:\adsense\searchconsole"
files = [
    "https___multipdfdoc.com_-Performance-on-Search-2026-10-16.xlsx",
    "https___multipdfdoc.com_-Performance-on-Search-2026-10-19.xlsx",
    "https___multipdfdoc.com_-Performance-on-Search-2026-10-22.xlsx",
    "https___multipdfdoc.com_-Performance-on-Search-2026-10-23.xlsx",
    "https___multipdfdoc.com_-Performance-on-Search-2026-10-23 (1).xlsx",
    "https___multipdfdoc.com_-Performance-on-Search-2026-10-23 (2).xlsx"
]

print("=== TIMELINE COMPARISON OF SEARCH CONSOLE EXPORTS ===")
for fname in files:
    fpath = os.path.join(sc_dir, fname)
    if not os.path.exists(fpath):
        continue
    data = get_sheet_data(fpath)
    filters = {r[0]: r[1] for r in data.get('Filters', [])[1:] if len(r) >= 2}
    chart = data.get('Chart', [])
    queries = data.get('Queries', [])
    pages = data.get('Pages', [])
    countries = data.get('Countries', [])
    
    total_impressions = 0
    if len(chart) > 1:
        for r in chart[1:]:
            try:
                total_impressions += float(r[2]) if len(r) > 2 and r[2] != '' else 0
            except:
                pass
                
    print(f"\n--- {fname} ---")
    print(f"Filter: {filters}")
    print(f"Total Impressions in Chart: {total_impressions}")
    print(f"Unique Queries: {len(queries)-1 if len(queries)>0 else 0}")
    print(f"Unique Pages: {len(pages)-1 if len(pages)>0 else 0}")
    print(f"Unique Countries: {len(countries)-1 if len(countries)>0 else 0}")
    
    if len(queries) > 1:
        print("Top 3 Queries:")
        for q in queries[1:4]:
            print(f"  {q[0]} | Impr: {q[2]} | Pos: {q[4]}")
    if len(pages) > 1:
        print("Top 3 Pages:")
        for p in pages[1:4]:
            print(f"  {p[0]} | Impr: {p[2]} | Pos: {p[4]}")
