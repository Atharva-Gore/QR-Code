import jsQR from "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.mjs";

// Generate QR
window.generateQR = function () {
  const input = document.getElementById("qrInput").value;
  const canvas = document.getElementById("qrCanvas");
  const downloadLink = document.getElementById("downloadLink");

  if (!input) return alert("Please enter some text or URL!");

  QRCode.toCanvas(canvas, input, { width: 200 }, function (error) {
    if (error) console.error(error);
    else {
      downloadLink.href = canvas.toDataURL();
      downloadLink.style.display = "inline";
    }
  });
};

// Scanner
const video = document.getElementById("video");
const scanCanvas = document.getElementById("scanCanvas");
const scanResult = document.getElementById("scanResult");

const ctx = scanCanvas.getContext("2d");

navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // iOS
    video.play();
    requestAnimationFrame(tick);
  });

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    scanCanvas.width = video.videoWidth;
    scanCanvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height);
    const imageData = ctx.getImageData(0, 0, scanCanvas.width, scanCanvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code) {
      scanResult.textContent = `✅ Found: ${code.data}`;
    } else {
      scanResult.textContent = "📷 Waiting for scan...";
    }
  }
  requestAnimationFrame(tick);
}
