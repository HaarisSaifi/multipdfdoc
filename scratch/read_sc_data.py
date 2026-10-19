import zipfile
import xml.etree.ElementTree as ET
import os

path = r'd:\adsense\searchconsole\https___multipdfdoc.com_-Performance-on-Search-2026-10-16.xlsx'

if not os.path.exists(path):
    print("File not found:", path)
    exit(1)

with zipfile.ZipFile(path, 'r') as z:
    wb_xml = z.read('xl/workbook.xml')
    root = ET.fromstring(wb_xml)
    sheets = []
    for s in root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet'):
        sheets.append((s.attrib.get('name'), s.attrib.get('sheetId'), s.attrib.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')))

    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_xml = z.read('xl/sharedStrings.xml')
        ss_root = ET.fromstring(ss_xml)
        for si in ss_root.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)

    # Map rId to target sheet xml file from workbook relationships
    rels = {}
    if 'xl/_rels/workbook.xml.rels' in z.namelist():
        r_xml = z.read('xl/_rels/workbook.xml.rels')
        r_root = ET.fromstring(r_xml)
        for rel in r_root:
            rels[rel.attrib.get('Id')] = rel.attrib.get('Target')

    print(f"Workbook has {len(sheets)} sheets: {[s[0] for s in sheets]}")

    for sheet_name, sheet_id, r_id in sheets:
        target = rels.get(r_id, f'worksheets/sheet{sheet_id}.xml')
        if not target.startswith('xl/'):
            target = 'xl/' + target
        if target in z.namelist():
            s_xml = z.read(target)
            s_root = ET.fromstring(s_xml)
            rows = s_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
            print(f"\n==========================================")
            print(f"SHEET: {sheet_name} (Total rows: {len(rows)})")
            print(f"==========================================")
            for r_idx, r in enumerate(rows):
                cells = []
                for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                    v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                    val = v.text if v is not None else ''
                    t = c.attrib.get('t')
                    if t == 's' and val.isdigit():
                        val = shared_strings[int(val)]
                    cells.append(str(val))
                if r_idx < 50:
                    print(f"Row {r_idx+1}: " + " | ".join(cells))
                elif r_idx == 50:
                    print(f"... and {len(rows) - 50} more rows ...")
