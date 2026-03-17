import { jsPDF } from 'jspdf';
import { PASSPORT, LAYOUT } from '../constants';

/**
 * Generate a PDF with passport photos arranged on A4.
 * @param {string} imageDataUrl - The final enhanced photo base64
 * @param {number} count - Number of photos to print
 * @param {object} opts - { borderStyle, borderColor, showCutLines, bgColor, showDetails, personName, personDob }
 */
export async function generatePDF(imageDataUrl, count, opts = {}) {
  const {
    borderStyle = 'thin',
    borderColor = '#1a1410',
    showCutLines = true,
    showDetails = false,
    personName = '',
    personDob = '',
  } = opts;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageW = 210;
  const pageH = 297;
  const margin = LAYOUT.MARGIN_MM;
  const gap = LAYOUT.GAP_MM;
  const photoW = PASSPORT.WIDTH_MM;
  const photoH = PASSPORT.HEIGHT_MM;
  const detailH = showDetails ? 8 : 0; // mm below each photo for text

  const cols = LAYOUT.COLS;
  const rows = Math.ceil(count / cols);

  // Calculate spacing to center the grid
  const totalW = cols * photoW + (cols - 1) * gap;
  const totalH = rows * (photoH + detailH) + (rows - 1) * gap;
  const startX = (pageW - totalW) / 2;
  const startY = margin + (pageH - 2 * margin - totalH) / 2;

  const borderWidths = { none: 0, thin: 0.2, medium: 0.4, thick: 0.6, white: 0.4 };
  const bw = borderWidths[borderStyle] || 0;

  let placed = 0;
  for (let r = 0; r < rows && placed < count; r++) {
    for (let c = 0; c < cols && placed < count; c++) {
      const x = startX + c * (photoW + gap);
      const y = startY + r * (photoH + gap + detailH);

      // Add photo
      pdf.addImage(imageDataUrl, 'JPEG', x, y, photoW, photoH);

      // Border
      if (bw > 0) {
        pdf.setDrawColor(borderColor);
        pdf.setLineWidth(bw);
        pdf.rect(x, y, photoW, photoH);
      }

      // Cut lines (dashed grey, outside the photo)
      if (showCutLines) {
        pdf.setDrawColor('#aaaaaa');
        pdf.setLineWidth(0.1);
        pdf.setLineDashPattern([1, 1], 0);
        // horizontal
        pdf.line(startX - 2, y, startX + totalW + 2, y);
        pdf.line(startX - 2, y + photoH, startX + totalW + 2, y + photoH);
        // vertical
        pdf.line(x, startY - 2, x, startY + totalH + 2);
        pdf.line(x + photoW, startY - 2, x + photoW, startY + totalH + 2);
        pdf.setLineDashPattern([], 0);
      }

      // Details below photo
      if (showDetails && (personName || personDob)) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(5);
        pdf.setTextColor('#1a1410');
        const cx = x + photoW / 2;
        if (personName) {
          pdf.text(personName.toUpperCase(), cx, y + photoH + 3, { align: 'center' });
        }
        if (personDob) {
          pdf.text(`DOB: ${personDob}`, cx, y + photoH + 6.5, { align: 'center' });
        }
      }

      placed++;
    }
  }

  // Page label
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor('#aaaaaa');
  pdf.text('Passport Photo Studio • Indian Standard 35×45mm • 300 DPI', pageW / 2, pageH - 5, { align: 'center' });

  return pdf;
}

export async function downloadPDF(imageDataUrl, count, opts) {
  const pdf = await generatePDF(imageDataUrl, count, opts);
  pdf.save('passport-photos.pdf');
}

export async function getPDFBlob(imageDataUrl, count, opts) {
  const pdf = await generatePDF(imageDataUrl, count, opts);
  return pdf.output('blob');
}
