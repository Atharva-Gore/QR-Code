import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.mjs";

// Generate QR Code
window.generateQR = function () {
  const input = document.getElementById("qrInput").value;
  const canvas = document.getElementById("qrCanvas");
  const downloadLink = document.getElementById("downloadLink");

  if (!input) return alert("Please enter text to generate QR!");

  QRCode.toCanvas(canvas, input, { width: 200 }, (error) => {
    if (error) {
      console.error("QR Error:", error);
    } else {
      const imageURL = canvas.toDataURL("image/png");
      downloadLink.href = imageURL;
      downloadLink.style.display = "inline-block";
    }
  });
};

// Scan QR Code from Webcam
const video = document.getElementById("video");
const scanCanvas = document.getElementById("scanCanvas");
const ctx = scanCanvas.getContext("2d");
const scanResult = document.getElementById("scanResult");

navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(scanLoop);
  })
  .catch((err) => {
    console.error("Camera Error:", err);
    scanResult.textContent = "❌ Cannot access camera.";
  });

function scanLoop() {
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
  requestAnimationFrame(scanLoop);
}
