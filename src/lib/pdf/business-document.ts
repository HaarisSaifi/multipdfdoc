
export const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

interface BusinessDocument {
  title: string;
  number: string;
  details: string[];
  items: { description: string; amount: number; extra?: string }[];
  totals: { label: string; amount: number }[];
  currency: string;
  notes: string[];
  disclaimer?: string;
}

/** Wrap every user field and paginate; never silently truncate descriptions or names. */
export async function createBusinessDocument(data: BusinessDocument): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const clean = (value: string) => {
    const text = value.replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"').replace(/[\u2013\u2014]/g, "-").replace(/\u2026/g, "...").replace(/\t/g, "    ");
    try { regular.encodeText(text.replace(/\n/g, "")); }
    catch { throw new Error("This PDF font does not support a character in your entries. Use Latin text, or export with software that supports your script; your text has not been silently removed."); }
    return text;
  };
  const money = (amount: number) => {
    if (!Number.isFinite(amount) || Math.abs(amount) > 1e12) throw new Error("Enter finite monetary values below one trillion.");
    return `${data.currency} ${roundMoney(amount).toFixed(2)}`;
  };
  let page = doc.addPage([612, 792]);
  let y = 740;
  const newPage = () => { page = doc.addPage([612, 792]); y = 740; };
  const draw = (value: string, strong = false, size = 10, width = 512) => {
    const font = strong ? bold : regular;
    for (const paragraph of clean(value).split("\n")) {
      let line = "";
      // Character wrapping also handles long URLs and identifiers with no spaces.
      for (const character of paragraph) {
        if (font.widthOfTextAtSize(line + character, size) > width && line) {
          if (y < 68) newPage();
          page.drawText(line, { x: 50, y, font, size, color: rgb(0.12, 0.16, 0.23) });
          y -= size + 6;
          line = character;
        } else line += character;
      }
      if (y < 68) newPage();
      page.drawText(line, { x: 50, y, font, size, color: rgb(0.12, 0.16, 0.23) });
      y -= size + 6;
    }
  };
  draw(data.title, true, 22);
  draw(`Reference: ${data.number}`, true);
  if (data.disclaimer) draw(data.disclaimer, true, 9);
  y -= 12;
  for (const detail of data.details) draw(detail);
  y -= 12;
  draw("ITEMS", true, 12);
  data.items.forEach((item, index) => {
    draw(`${index + 1}. ${item.description}`, true);
    draw(`${item.extra ? item.extra + " | " : ""}${money(item.amount)}`);
    y -= 5;
  });
  y -= 8;
  for (const total of data.totals) draw(`${total.label}: ${money(total.amount)}`, true, 12);
  y -= 16;
  for (const note of data.notes.filter(Boolean)) draw(note);
  doc.getPages().forEach((entry, index, pages) => entry.drawText(`MultiPDF Doc | ${data.title} | Page ${index + 1} of ${pages.length}`, { x: 50, y: 30, size: 8, font: regular, color: rgb(0.4, 0.45, 0.5) }));
  return doc.save();
}
