import { jsPDF } from 'jspdf';

const CARD_W_MM = 85.6;
const CARD_H_MM = 53.98;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function imageToBase64(src) {
  const img    = await loadImage(src);
  const canvas = document.createElement('canvas');
  canvas.width  = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.95);
}

export async function generateAadhaarPDF(frontSrc, backSrc, opts = {}) {
  const {
    gapMM   = 5,
    frontPos = null,
    backPos  = null,
  } = opts;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = 210;
  const pageH = 297;

  // Use custom positions if provided, else use default centered layout
  const fPos = frontPos || {
    x: (pageW - CARD_W_MM) / 2,
    y: 15,
    w: CARD_W_MM,
    h: CARD_H_MM,
  };

  const bPos = backPos || {
    x: (pageW - CARD_W_MM) / 2,
    y: 15 + CARD_H_MM + gapMM,
    w: CARD_W_MM,
    h: CARD_H_MM,
  };

  const [frontB64, backB64] = await Promise.all([
    imageToBase64(frontSrc),
    imageToBase64(backSrc),
  ]);

  // Front card
  pdf.addImage(frontB64, 'JPEG', fPos.x, fPos.y, fPos.w, fPos.h);
  pdf.setDrawColor('#cccccc');
  pdf.setLineWidth(0.3);
  pdf.rect(fPos.x, fPos.y, fPos.w, fPos.h);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor('#999999');
  pdf.text('FRONT', fPos.x, fPos.y - 1.5);

  // Back card
  pdf.addImage(backB64, 'JPEG', bPos.x, bPos.y, bPos.w, bPos.h);
  pdf.setDrawColor('#cccccc');
  pdf.setLineWidth(0.3);
  pdf.rect(bPos.x, bPos.y, bPos.w, bPos.h);
  pdf.setFontSize(6);
  pdf.setTextColor('#999999');
  pdf.text('BACK', bPos.x, bPos.y - 1.5);

  // Footer
  pdf.setFontSize(6);
  pdf.setTextColor('#aaaaaa');
  pdf.text(
    'Aadhaar Card \u2022 Passport Photo Studio',
    pageW / 2, pageH - 4, { align: 'center' }
  );

  pdf.save('aadhaar-card.pdf');
}