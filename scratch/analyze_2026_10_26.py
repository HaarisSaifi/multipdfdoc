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

fpath = r"d:\adsense\searchconsole\https___multipdfdoc.com_-Performance-on-Search-2026-10-26.xlsx"
data = get_sheet_data(fpath)

print("="*60)
print("DEEP ANALYSIS OF: 2026-10-26 SEARCH CONSOLE REPORT")
print("="*60)

for sname, rows in data.items():
    print(f"\n--- SHEET: {sname} ({len(rows)} rows) ---")
    for r in rows:
        print(" | ".join(str(x) for x in r))
