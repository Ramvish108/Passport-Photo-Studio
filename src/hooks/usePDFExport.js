import { useState } from 'react';
import { downloadPDF, getPDFBlob } from '../utils/pdfUtils';
import { sharePDF } from '../utils/shareUtils';
import { usePhotoStore } from '../store/photoStore';

export function usePDFExport() {
  const [exporting, setExporting] = useState(false);
  const [shareStatus, setShareStatus] = useState(null);

  const {
    enhancedImageUrl, croppedImageUrl,
    photoCount, borderStyle, borderColor,
    showCutLines, showDetails, personName, personDob,
  } = usePhotoStore();

  const imageUrl = enhancedImageUrl || croppedImageUrl;

  const getOpts = () => ({
    borderStyle, borderColor, showCutLines,
    showDetails, personName, personDob,
  });

  const handleDownload = async () => {
    if (!imageUrl) return;
    setExporting(true);
    try {
      await downloadPDF(imageUrl, photoCount, getOpts());
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setExporting(false);
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    setExporting(true);
    setShareStatus(null);
    try {
      const blob = await getPDFBlob(imageUrl, photoCount, getOpts());
      const result = await sharePDF(blob);
      setShareStatus(result.success ? 'Shared!' : 'Cancelled');
      setTimeout(() => setShareStatus(null), 3000);
    } catch (e) {
      setShareStatus('Share failed');
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return { handleDownload, handleShare, exporting, shareStatus };
}
