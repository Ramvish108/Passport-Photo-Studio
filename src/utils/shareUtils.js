/**
 * Share or download the PDF using the Web Share API (mobile) or direct download.
 */
export async function sharePDF(blob, filename = 'passport-photos.pdf') {
  const file = new File([blob], filename, { type: 'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Passport Photos',
        text: 'Generated passport size photos — Indian Standard 35×45mm',
        files: [file],
      });
      return { success: true, method: 'share' };
    } catch (err) {
      if (err.name !== 'AbortError') {
        // Fall through to download
        return downloadBlob(blob, filename);
      }
      return { success: false, method: 'aborted' };
    }
  }

  // Fallback: open in new tab / download
  return downloadBlob(blob, filename);
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return { success: true, method: 'download' };
}
