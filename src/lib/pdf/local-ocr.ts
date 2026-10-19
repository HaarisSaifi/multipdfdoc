import type { Worker, LoggerMessage } from "tesseract.js";

export function waitForOcr<T>(job: Promise<T>, signal: AbortSignal, timeoutMs = 120000): Promise<T> {
  return new Promise((resolve, reject) => {
    const onAbort = () => finish(new DOMException("Extraction cancelled. Your original file is unchanged.", "AbortError"));
    const timer = setTimeout(() => finish(new Error("OCR took too long. Try a smaller, clearer scan and run extraction again.")), timeoutMs);
    let settled = false;
    function finish(error?: unknown, result?: T) {
      if (settled) return;
      settled = true; clearTimeout(timer); signal.removeEventListener("abort", onAbort);
      if (error) reject(error); else resolve(result as T);
    }
    signal.addEventListener("abort", onAbort, { once: true });
    job.then(value => finish(undefined, value), error => finish(error));
    if (signal.aborted) onAbort();
  });
}

export async function createLocalOcrWorker(signal: AbortSignal, logger: (event: LoggerMessage) => void): Promise<Worker> {
  signal.throwIfAborted();
  let rejectInitialization: (error: Error) => void = () => {};
  const initializationFailure = new Promise<never>((_, reject) => { rejectInitialization = reject; });
  const creation = import("tesseract.js").then(({ createWorker, OEM }) => createWorker("eng", OEM.LSTM_ONLY, {
    workerPath: "/ocr-worker.js",
    corePath: "/vendor/ocr/7.0.0",
    langPath: "/vendor/ocr/lang",
    cachePath: "multipdfdoc-eng-4-best-int",
    workerBlobURL: false,
    logger,
    errorHandler: () => rejectInitialization(new Error("The local OCR engine could not load or process this scan. Check your connection and try a smaller, clearer image.")),
  }));
  try { return await waitForOcr(Promise.race([creation, initializationFailure]), signal, 45000); }
  catch (error) {
    // A worker that finishes initializing after cancellation must also be released.
    creation.then(worker => worker.terminate()).catch(() => {});
    throw error;
  }
}
