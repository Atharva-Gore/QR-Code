import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.mjs";

// QR Generator
window.generateQR = function () {
  const input = document.getElementById("qrInput").value;
  const canvas = document.getElementById("qrCanvas");
  const downloadLink = document.getElementById("downloadLink");

  if (!input) return alert("Enter text to generate QR!");

  QRCode.toCanvas(canvas, input, { width: 200 }, (error) => {
    if (error) console.error(error);
    else {
      downloadLink.href = canvas.toDataURL();
      downloadLink.style.display = "block";
    }
  });
};

// QR Scanner
const video = document.getElementById("video");
const scanCanvas = document.getElementById("scanCanvas");
const scanResult = document.getElementById("scanResult");

const ctx = scanCanvas.getContext("2d");

// Access camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then(stream => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true);
    video.play();
    requestAnimationFrame(scanFrame);
  })
  .catch(err => {
    console.error("Camera error:", err);
    scanResult.textContent = "❌ Cannot access camera.";
  });

// Scan logic
function scanFrame() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    scanCanvas.width = video.videoWidth;
    scanCanvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);

    const imageData = ctx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      scanResult.textContent = `✅ Scanned: ${code.data}`;
    }
  }
  requestAnimationFrame(scanFrame);
}
