import React, { useRef } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import A4SheetLayout from '../components/A4SheetLayout';
import ExportPanel from '../components/ExportPanel';
import PersonDetails from '../components/PersonDetails';
import AdvancedOptions from '../components/AdvancedOptions';
import { usePhotoStore } from '../store/photoStore';
import styles from './PreviewPage.module.css';

export default function PreviewPage() {
  const { enhancedImageUrl, croppedImageUrl, setStep, reset } = usePhotoStore();
  const sheetRef = useRef(null);

  const imageUrl = enhancedImageUrl || croppedImageUrl;

  return (
    <main className={styles.page}>
      <div className={styles.layout}>

        {/* Left: Sheet preview */}
        <div className={styles.leftCol}>
          <div className={styles.previewHeader}>
            <h2 className={styles.title}>A4 Print Sheet</h2>
            <p className={styles.subtitle}>
              Actual print dimensions will be exact — preview is scaled for screen.
            </p>
          </div>
          <div className={styles.sheetWrapper}>
            <A4SheetLayout ref={sheetRef} imageUrl={imageUrl} />
          </div>
        </div>

        {/* Right: Controls */}
        <div className={styles.rightCol}>
          <ExportPanel />
          <PersonDetails />
          <AdvancedOptions />

          <div className={styles.navRow}>
            <button className={styles.backBtn} onClick={() => setStep('edit')}>
              <ArrowLeft size={15} /> Edit Photo
            </button>
            <button
              className={styles.newBtn}
              onClick={() => { reset(); }}
            >
              <RefreshCw size={15} /> New Photo
            </button>
          </div>

          <div className={styles.tips}>
            <h3 className={styles.tipsTitle}>Print Tips</h3>
            <ul className={styles.tipsList}>
              <li>Use photo paper for best results (glossy or satin)</li>
              <li>Set printer to "Actual size" — do not scale to fit</li>
              <li>Resolution: 300 DPI minimum for sharp prints</li>
              <li>Cut along the dashed lines with scissors or a paper cutter</li>
              <li>Indian passport photo must have white/off-white background</li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
}
