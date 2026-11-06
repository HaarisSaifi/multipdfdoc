import { ToolBreadcrumb } from "@/components/seo/ToolBreadcrumb";
import { ValueWrapper } from "@/components/seo/ValueWrapper";
import { toolSources } from "@/content/tool-supplements";
import type { Metadata } from "next";

const title = "Resize Photo & Signature to 20KB, 50KB or 100KB — Exam Portal Tool";
const description = "Crop a photo to 3.5×4.5 cm or 600×600 px and compress it under 20KB, 50KB, 100KB or a custom limit for exam, visa and job portals. Free, private, no upload.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://multipdfdoc.com/image/portal-resizer" },
  openGraph: { title, description, url: "https://multipdfdoc.com/image/portal-resizer" },
};

export default function PortalResizerLayout({ children }: { children: React.ReactNode }) {
  return <><ToolBreadcrumb name="Photo & signature resizer" href="/image/portal-resizer" />{children}<div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10"><ValueWrapper sources={toolSources["image/portal-resizer"]}
    toolName="Exam & Portal Photo / Signature Resizer"
    title="Portal Photo Guide: Pixel Dimensions, KB Limits and Why Uploads Get Rejected"
    subtitle="How online application portals check photos and signatures, and how to meet both the size and the dimension rule without ruining the image."
    sections={[
      {
        heading: "Portals check three separate things",
        content: `Most application portals validate an uploaded photo or signature against three independent rules: the file format (usually JPEG), the pixel dimensions or aspect ratio, and the file size in kilobytes. Passing one does not pass the others. A 45 KB image can still be rejected because it is 640×480 instead of a required portrait ratio, and a correctly cropped 3.5 × 4.5 cm photo straight from a phone is often several megabytes, far above a 50 KB cap.

Many portals also set a minimum size, such as 10 KB or 20 KB, to reject images that are too degraded to identify a person. Some add visual rules that no resizing tool can fix: a plain light background, a recent photo, the face filling a set share of the frame, no glasses glare, and a signature in dark ink. Read the current notification or instruction page for the exact exam, visa or employer you are applying to, because these values differ between organizations and are revised from year to year. This tool lets you enter whatever numbers the official instructions give.`
      },
      {
        heading: "Step-by-step: from phone photo to accepted upload",
        content: `Step 1: Choose Photo or Signature. Photo mode offers passport-style 3.5 × 4.5 cm and square 2 × 2 inch presets; Signature mode offers wide strips and an option to whiten the paper background.

Step 2: Add your image. JPG, PNG and WebP are accepted. iPhone HEIC photos must first be exported or shared as JPG. The original stays untouched on your device.

Step 3: Crop. The preview frame always has the exact output ratio. Drag the image or use the arrow keys to position it, and use the zoom slider so the face or signature fills the frame as the instructions require. The image always covers the full frame, so you will never get blank borders.

Step 4: Set the size limit. Pick 20, 50, 100 or 240 KB, or enter a custom maximum, plus an optional minimum. Choose JPEG unless the portal specifically requests PNG.

Step 5: Compress and check. Press Resize & Compress, then read the result line: pixel dimensions, size in binary KB and decimal kB, and the JPEG quality that was used. Open the downloaded file and confirm the face or signature is sharp before you upload it.`
      },
      {
        heading: "How the compression loop finds the best quality",
        content: `JPEG compression is controlled by a quality value between 0 and 1. Higher quality keeps more detail and produces a larger file, but the relationship is not linear and depends heavily on the picture: a plain background compresses far better than a patterned shirt. Instead of guessing, the tool renders your crop once onto an HTML5 canvas at the exact output dimensions and then runs a binary search over the quality value. Each step encodes the canvas with the browser's built-in JPEG encoder and compares the byte count with your maximum. Nine steps narrow the range to well under one percent of quality, and the highest-quality version that still fits is kept.

If even the lowest quality is too large, the tool tells you instead of quietly shrinking the dimensions, because many portals reject images whose pixel size changed. In that case use the smallest dimensions the instructions allow. PNG is lossless, so it has no quality setting; if a PNG is over the limit the tool explains that and suggests JPEG. Kilobyte units differ too: this tool treats 1 KB as 1,024 bytes and also shows the decimal value (1 kB = 1,000 bytes), so keep a small margin below a hard limit.`
      },
      {
        heading: "Worked examples: US visa photo and a 20 KB signature",
        content: `The U.S. Department of State's digital image requirements for visa photos call for a square JPEG between 600×600 and 1200×1200 pixels, in color, no larger than 240 kB. Choose Photo, select the 2 × 2 in · 600 px preset, set the maximum to 240 KB and compress. A typical 600×600 portrait lands comfortably under the limit at high quality. Keep "Show face guide" on while cropping: the dashed oval marks a head height inside the 50–69% range the State Department describes, and the green band marks where the eyes should sit (56–69% of the image height, measured from the bottom). Zoom until the top of the hair and the chin touch the oval. The guide appears only on screen and is never written into the downloaded file. It is an alignment aid, not an automated check; expression, lighting and background are still your responsibility.

For a signature limited to 20 KB, photograph your signature on white paper in daylight, choose Signature and the 3.5 × 1.5 cm preset, and keep "Whiten paper background" on. The threshold slider turns slightly grey paper pure white while dark ink stays untouched; raise it if shadows remain and lower it if thin strokes start to disappear. Because a clean white background compresses extremely well, signatures usually fit small limits at high JPEG quality. If the portal also states a minimum such as 10 KB and the result is smaller, increase the pixel dimensions within the allowed range rather than adding noise.`
      },
      {
        heading: "Privacy and what this tool does not do",
        content: `Identity photos and signatures are sensitive. Every step here, including decoding, cropping, background whitening and JPEG encoding, runs inside your browser using the Canvas API. The image is not uploaded to a server. The compressed result is held as a temporary browser object until you download it or leave the page; your downloaded file is then under your control, so delete it from shared computers.

The output contains no camera metadata, because canvas re-encoding drops EXIF data such as location and device model. It also does not embed a DPI value; a few desktop programs will therefore display 72 or 96 DPI, while most portals check only pixel dimensions and file size. The tool does not remove backgrounds from photos, retouch faces, or certify that an image meets any government standard. Submitting an edited photo that misrepresents your appearance can lead to rejection, so only crop, resize and compress a genuine recent photo.`
      }
    ]}
    tableTitle="Preset reference (check your official instructions before relying on any value)"
    tableHeaders={["Preset", "Output pixels", "Typical use"]}
    tableRows={[
      ["3.5 × 4.5 cm", "413 × 531 px (300 DPI)", "Passport-style portrait used by many exam and visa forms"],
      ["2 × 2 in · 600 px", "600 × 600 px", "US visa digital photo minimum (square, ≤ 240 kB JPEG)"],
      ["2 × 2 in · 1200 px", "1200 × 1200 px", "US visa digital photo maximum"],
      ["3.5 × 1.5 cm signature", "413 × 177 px (300 DPI)", "Signature strip for application forms"],
      ["300 × 100 px signature", "300 × 100 px", "Generic 3 : 1 signature field"],
    ]}
    faqs={[
      { question: "How do I reduce a photo to under 50 KB without changing its size in pixels?", answer: "Choose the required dimensions, set the maximum to 50 KB and use JPEG. The tool keeps the pixel dimensions fixed and lowers only the JPEG quality, choosing the highest quality that fits under 50 KB." },
      { question: "What size is a 3.5 cm × 4.5 cm photo in pixels?", answer: "At 300 DPI it is about 413 × 531 pixels, which is the preset used here. At 200 DPI it is about 276 × 354 pixels. Use the pixel values printed in your official instructions when they are given; you can enter them with Custom px." },
      { question: "What are the US visa photo file requirements?", answer: "According to the U.S. Department of State, a digital visa photo must be a square JPEG from 600×600 to 1200×1200 pixels, in color, and no larger than 240 kB. Composition rules such as head size and background also apply." },
      { question: "Is my photo uploaded anywhere?", answer: "No. Cropping and compression run on your device with the browser's Canvas API. Nothing is sent to a server, and the output has no EXIF location data." },
      { question: "Why is my signature result smaller than the portal's minimum?", answer: "Clean white backgrounds compress very well. Increase the pixel dimensions within the allowed range, or turn off background whitening, then compress again. Avoid artificially padding a file." }
    ]}
  /></div></>;
}
