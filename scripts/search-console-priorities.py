"""Local Search Console CSV triage. No network, credentials or paid SEO tools."""
import argparse
import csv
import io
from pathlib import Path


def priorities(stream):
    reader = csv.DictReader(stream)
    if not reader.fieldnames:
        raise ValueError("CSV needs a header.")
    headers = {name.lower().strip(): name for name in reader.fieldnames}
    if not {"clicks", "impressions", "position"} <= headers.keys():
        raise ValueError("Export the English Search Console Performance table with Clicks, Impressions and Position.")
    label = next((headers[x] for x in ("top queries", "queries", "query", "top pages", "pages", "page") if x in headers), None)
    if not label:
        raise ValueError("CSV needs a Query/Top queries or Page/Top pages column.")
    rows = []
    for line, row in enumerate(reader, 2):
        try:
            clicks = int(row[headers["clicks"]].replace(",", ""))
            impressions = int(row[headers["impressions"]].replace(",", ""))
            position = float(row[headers["position"]])
            if clicks < 0 or impressions < 0 or clicks > impressions or not 1 <= position <= 1000:
                raise ValueError()
        except (ValueError, TypeError, AttributeError, KeyError):
            raise ValueError("Invalid numeric data on CSV line " + str(line)) from None
        ctr = clicks / impressions if impressions else 0
        if impressions < 25:
            action = "Collect more data"
        elif 8 <= position <= 20:
            action = "Review intent, output examples and relevant internal links"
        elif 3 <= position < 8 and ctr < 0.02:
            action = "Review title/snippet against the actual query"
        elif position < 8:
            action = "Maintain useful content and check completion"
        else:
            action = "Check intent and indexing; do not promise a quick win"
        rows.append({"label": row[label], "clicks": clicks, "impressions": impressions, "ctr": ctr, "position": position, "action": action})
    # Local heuristics, not KD estimates or a prediction of traffic.
    rows.sort(key=lambda r: (r["action"] == "Collect more data", not 8 <= r["position"] <= 20, -r["impressions"]))
    return rows


def markdown(rows, source):
    text = "# Search Console priorities\n\nSource: " + source + "\n\n"
    text += "Observed export data only. Position is an average, not a stable individual rank. Thresholds (25 impressions, 2% CTR, positions 8–20) are triage heuristics, not ranking rules or keyword difficulty. Compare the same date range, search type and country filters. Query and Page exports are separate aggregates; do not infer query–page pairs from them.\n\n"
    if not rows:
        return text + "No rows yet. Wait for Search Console data; no rankings, demand or low-KD opportunities were invented.\n"
    text += "| Query or page | Clicks | Impressions | CTR | Avg position | Next review |\n| --- | ---: | ---: | ---: | ---: | --- |\n"
    for row in rows:
        label = str(row["label"]).replace("|", "\\|").replace("\n", " ").replace("<", "&lt;").replace(">", "&gt;")
        text += "| {} | {} | {} | {:.1%} | {:.1f} | {} |\n".format(label, row["clicks"], row["impressions"], row["ctr"], row["position"], row["action"])
    return text


def self_test():
    rows = priorities(io.StringIO("Top queries,Clicks,Impressions,Position\nclear scan,2,100,12\nsmall sample,0,4,8\nworking tool,9,100,2\n"))
    assert rows[0]["label"] == "clear scan" and rows[0]["ctr"] == 0.02
    assert rows[-1]["action"] == "Collect more data"
    assert "No rows yet" in markdown([], "empty export")
    try:
        priorities(io.StringIO("Pages,Clicks,Impressions,Position\n/,10,2,5\n"))
    except ValueError:
        pass
    else:
        raise AssertionError("Invalid click counts accepted")
    print("PASS Search Console CSV validation and observed-data prioritization")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", type=Path)
    parser.add_argument("--output", type=Path, default=Path("docs/reports/search-console-priorities.md"))
    parser.add_argument("--self-test", action="store_true")
    args = parser.parse_args()
    if args.self_test:
        self_test()
    elif args.csv:
        with args.csv.open(encoding="utf-8-sig", newline="") as stream:
            rows = priorities(stream)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(markdown(rows, args.csv.name), encoding="utf-8")
        print("Saved", len(rows), "observed rows to", args.output)
    else:
        parser.error("Supply --csv EXPORT.csv or --self-test.")
