// Keep failures inside the local OCR workflow and release a failed worker.
// Upstream Tesseract posts a rejected job before the parent handles the error.
const deliver = self.postMessage.bind(self);
self.postMessage = (...args) => {
  deliver(...args);
  if (args[0]?.status === "reject") self.close();
};
importScripts("/vendor/ocr/7.0.0/worker.min.js");
