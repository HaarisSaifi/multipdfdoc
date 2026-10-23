import os
import zipfile
import xml.etree.ElementTree as ET

def parse_xlsx(file_path):
    print(f"\n==================================================")
    print(f"FILE: {os.path.basename(file_path)}")
    print(f"==================================================")
    
    with zipfile.ZipFile(file_path, 'r') as z:
        # Read shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            ss_tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in ss_tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text_parts = []
                for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
                    if t.text:
                        text_parts.append(t.text)
                shared_strings.append(''.join(text_parts))
        
        # Read workbook to get sheet names
        wb_tree = ET.fromstring(z.read('xl/workbook.xml'))
        sheets = []
        for s in wb_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
            sheets.append(s.attrib['name'])
        
        print(f"Sheets found: {sheets}")
        
        # Parse each sheet
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
            
            print(f"\n--- Sheet: {sheet_name} ({len(rows)} rows) ---")
            for r in rows:
                print(" | ".join(str(x) for x in r))
            sheet_idx += 1

sc_dir = r"d:\adsense\searchconsole"
files = sorted([os.path.join(sc_dir, f) for f in os.listdir(sc_dir) if f.endswith('.xlsx')])
for f in files:
    parse_xlsx(f)
