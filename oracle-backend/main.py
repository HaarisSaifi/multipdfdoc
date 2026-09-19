"""
MultiPDF Doc (multipdfdoc.com) - High-Performance OCR Microservice
Engineered for Oracle Cloud Always Free Tier (4 OCPU ARM64, 24GB RAM)
"""

import os
import time
import base64
import io
import logging
from typing import Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

# Configure Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("multipdf-ocr")

app = FastAPI(
    title="MultiPDF Doc Heavy OCR Engine",
    version="1.0.0",
    description="Microservice for Deep Document & Handwriting Extraction",
)

# CORS Middleware: Allow multipdfdoc.com and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://multipdfdoc.com", "https://www.multipdfdoc.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
PADDLE_OCR = None
TROCR_PROCESSOR = None
TROCR_MODEL = None

def load_paddle_ocr():
    global PADDLE_OCR
    if PADDLE_OCR is None:
        try:
            logger.info("Initializing PaddleOCR engine...")
            from paddleocr import PaddleOCR
            PADDLE_OCR = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
            logger.info("PaddleOCR engine loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load PaddleOCR: {e}")
    return PADDLE_OCR

def load_trocr():
    global TROCR_PROCESSOR, TROCR_MODEL
    if TROCR_MODEL is None:
        try:
            logger.info("Initializing Microsoft TrOCR handwriting transformer...")
            from transformers import TrOCRProcessor, VisionEncoderDecoderModel
            model_name = "microsoft/trocr-base-handwritten"
            TROCR_PROCESSOR = TrOCRProcessor.from_pretrained(model_name)
            TROCR_MODEL = VisionEncoderDecoderModel.from_pretrained(model_name)
            TROCR_MODEL.eval()
            logger.info("TrOCR handwriting model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load TrOCR: {e}")
    return TROCR_PROCESSOR, TROCR_MODEL

class OCRRequest(BaseModel):
    image_base64: str
    mime_type: Optional[str] = "image/png"
    mode: Optional[str] = "auto" # "auto" | "document" | "handwriting"

class OCRResponse(BaseModel):
    text: str
    confidence: float
    engine: str
    latency_ms: int

@app.get("/health")
def health_check():
    import psutil
    mem = psutil.virtual_memory()
    return {
        "status": "healthy",
        "service": "MultiPDF Doc OCR Microservice",
        "cpu_percent": psutil.cpu_percent(interval=0.1),
        "ram_total_gb": round(mem.total / (1024**3), 2),
        "ram_available_gb": round(mem.available / (1024**3), 2),
        "ram_percent": mem.percent,
        "models_loaded": {
            "paddle_ocr": PADDLE_OCR is not None,
            "trocr": TROCR_MODEL is not None,
        }
    }

@app.post("/ocr", response_model=OCRResponse)
def perform_ocr(req: OCRRequest):
    start_time = time.time()
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(req.image_base64)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image encoding: {str(e)}")

    extracted_lines = []
    engine_name = "PaddleOCR v4 Document Engine"
    avg_confidence = 0.95

    try:
        if req.mode == "handwriting":
            # Mode A: Handwriting via TrOCR or PaddleOCR handwriting weights
            processor, model = load_trocr()
            if model is not None and processor is not None:
                import torch
                pixel_values = processor(images=image, return_tensors="pt").pixel_values
                with torch.no_grad():
                    generated_ids = model.generate(pixel_values, max_new_tokens=256)
                recognized_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
                extracted_lines.append(recognized_text)
                engine_name = "Microsoft TrOCR (Handwriting Transformer)"
                avg_confidence = 0.94
            else:
                # Fallback to PaddleOCR
                ocr_engine = load_paddle_ocr()
                if ocr_engine:
                    result = ocr_engine.ocr(io.BytesIO(image_bytes), cls=True)
                    if result and result[0]:
                        for line in result[0]:
                            extracted_lines.append(line[1][0])
                engine_name = "PaddleOCR (Handwriting Fallback)"
        else:
            # Mode B: Standard Document OCR via PaddleOCR
            ocr_engine = load_paddle_ocr()
            if ocr_engine:
                result = ocr_engine.ocr(io.BytesIO(image_bytes), cls=True)
                if result and result[0]:
                    confidences = []
                    for line in result[0]:
                        text = line[1][0]
                        conf = line[1][1]
                        extracted_lines.append(text)
                        confidences.append(conf)
                    if confidences:
                        avg_confidence = round(sum(confidences) / len(confidences), 3)
            engine_name = "Baidu PaddleOCR v4"

        final_text = "\n".join(extracted_lines)
        latency = int((time.time() - start_time) * 1000)

        return OCRResponse(
            text=final_text,
            confidence=avg_confidence,
            engine=engine_name,
            latency_ms=latency
        )

    except Exception as e:
        logger.error(f"OCR processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"OCR execution failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Auto-preload PaddleOCR on startup
    load_paddle_ocr()
    uvicorn.run(app, host="0.0.0.0", port=8000)
