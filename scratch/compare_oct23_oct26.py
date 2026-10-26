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
f_oct23 = os.path.join(sc_dir, "https___multipdfdoc.com_-Performance-on-Search-2026-10-23.xlsx")
f_oct26 = os.path.join(sc_dir, "https___multipdfdoc.com_-Performance-on-Search-2026-10-26.xlsx")

d23 = get_sheet_data(f_oct23)
d26 = get_sheet_data(f_oct26)

print("=== COMPARISON BETWEEN OCT 23 (28d) AND OCT 26 (28d) ===")

# Chart totals
def get_chart_sum(d):
    s = 0
    for r in d.get('Chart', [])[1:]:
        try:
            s += float(r[2]) if len(r)>2 and r[2] != '' else 0
        except:
            pass
    return s

print(f"Total Impressions: Oct 23 = {get_chart_sum(d23)} | Oct 26 = {get_chart_sum(d26)} (+{get_chart_sum(d26)-get_chart_sum(d23)})")

# Pages delta
pages_23 = {r[0]: (float(r[2]), float(r[4])) for r in d23.get('Pages', [])[1:] if len(r) >= 5}
pages_26 = {r[0]: (float(r[2]), float(r[4])) for r in d26.get('Pages', [])[1:] if len(r) >= 5}

print("\n--- PAGES COMPARISON ---")
for p, (imp26, pos26) in sorted(pages_26.items(), key=lambda x: -x[1][0]):
    imp23, pos23 = pages_23.get(p, (0, 0))
    imp_diff = imp26 - imp23
    pos_diff = pos26 - pos23 if pos23 != 0 else 0
    print(f"{p}:")
    print(f"   Impressions: {imp23} -> {imp26} (delta: +{imp_diff})")
    print(f"   Position: {pos23:.2f} -> {pos26:.2f} (change: {pos_diff:+.2f})")

# Countries delta
countries_23 = {r[0]: (float(r[2]), float(r[4])) for r in d23.get('Countries', [])[1:] if len(r) >= 5}
countries_26 = {r[0]: (float(r[2]), float(r[4])) for r in d26.get('Countries', [])[1:] if len(r) >= 5}

print("\n--- COUNTRIES COMPARISON ---")
for c, (imp26, pos26) in sorted(countries_26.items(), key=lambda x: -x[1][0]):
    imp23, pos23 = countries_23.get(c, (0, 0))
    imp_diff = imp26 - imp23
    print(f"   {c:15s}: {imp23:4.0f} -> {imp26:4.0f} (delta: +{imp_diff:3.0f}) | Pos: {pos26:.1f}")

# Queries delta
queries_23 = {r[0]: (float(r[2]), float(r[4])) for r in d23.get('Queries', [])[1:] if len(r) >= 5}
queries_26 = {r[0]: (float(r[2]), float(r[4])) for r in d26.get('Queries', [])[1:] if len(r) >= 5}

print("\n--- QUERIES COMPARISON ---")
for q, (imp26, pos26) in sorted(queries_26.items(), key=lambda x: -x[1][0]):
    imp23, pos23 = queries_23.get(q, (0, 0))
    print(f"   {q:35s}: {imp23:4.0f} -> {imp26:4.0f} | Pos: {pos26:.1f}")
