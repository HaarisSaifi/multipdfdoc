import glob
from analyze_gsc import parse_full_xlsx

files = sorted(glob.glob('searchconsole/*.xlsx'))
print(f"{'Filename':<55} | {'Filter':<20} | {'Clicks':<6} | {'Imp':<6} | {'Avg Pos':<8}")
print("-" * 105)

for f in files:
    d = parse_full_xlsx(f)
    filt_val = "Unknown"
    if 'Filters' in d:
        filt_val = ", ".join([f"{r[0]}:{r[1]}" for r in d['Filters']])
    
    tot_clicks = 0
    tot_imp = 0
    positions = []
    if 'Pages' in d and len(d['Pages']) > 1:
        for r in d['Pages'][1:]:
            try:
                tot_clicks += float(r[1])
                tot_imp += float(r[2])
                positions.append(float(r[4]))
            except:
                pass
    avg_pos = sum(positions)/len(positions) if positions else 0.0
    print(f"{f:<55} | {filt_val[:20]:<20} | {tot_clicks:<6.0f} | {tot_imp:<6.0f} | {avg_pos:<8.1f}")
