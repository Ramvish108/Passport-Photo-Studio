import React from 'react';
import { Download, Share2, FileText, Loader2 } from 'lucide-react';
import { usePDFExport } from '../hooks/usePDFExport';
import styles from './ExportPanel.module.css';

export default function ExportPanel() {
  const { handleDownload, handleShare, exporting, shareStatus } = usePDFExport();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <FileText size={15} />
        <span>Export</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.downloadBtn}
          onClick={handleDownload}
          disabled={exporting}
        >
          {exporting
            ? <Loader2 size={18} className={styles.spin} />
            : <Download size={18} />}
          {exporting ? 'Generating PDF…' : 'Download PDF'}
        </button>

        <button
          className={styles.shareBtn}
          onClick={handleShare}
          disabled={exporting}
        >
          <Share2 size={16} />
          {shareStatus || 'Share'}
        </button>
      </div>

      <p className={styles.note}>
        A4 sheet · 300 DPI · Print-ready · Indian passport standard 35×45mm
      </p>
    </div>
  );
}
