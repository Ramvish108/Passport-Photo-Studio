import React, { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import CropEditor from '../components/CropEditor';
import EnhancePanel from '../components/EnhancePanel';
import PersonDetails from '../components/PersonDetails';
import AdvancedOptions from '../components/AdvancedOptions';
import PassportPhoto from '../components/PassportPhoto';
import { usePhotoStore } from '../store/photoStore';
import { useImageProcessor } from '../hooks/useImageProcessor';
import styles from './EditorPage.module.css';

export default function EditorPage() {
  const {
    croppedImageUrl, enhancedImageUrl,
    setStep,
  } = usePhotoStore();
  const { enhanceImage, processing } = useImageProcessor();

  const [cropDone, setCropDone] = useState(!!croppedImageUrl);

  const handleCropDone = () => {
    setCropDone(true);
  };

  const handleApplyEnhancement = async () => {
    if (croppedImageUrl) {
      await enhanceImage(croppedImageUrl);
    }
  };

  const handleNext = async () => {
    await handleApplyEnhancement();
    setStep('preview');
  };

  const displayImage = enhancedImageUrl || croppedImageUrl;

  return (
    <main className={styles.page}>
      <div className={styles.layout}>

        {/* Left: crop or preview */}
        <div className={styles.leftCol}>
          {!cropDone ? (
            <div className={styles.card}>
              <CropEditor onDone={handleCropDone} />
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.previewHeader}>
                <h2 className={styles.sectionTitle}>Photo Preview</h2>
                <button
                  className={styles.recropBtn}
                  onClick={() => setCropDone(false)}
                >
                  <RefreshCw size={14} /> Re-crop
                </button>
              </div>

              <div className={styles.photoPreview}>
                <PassportPhoto imageUrl={displayImage} size={160} />
                <div className={styles.photoMeta}>
                  <span className={styles.metaBadge}>35 × 45 mm</span>
                  <span className={styles.metaBadge}>300 DPI</span>
                  <span className={styles.metaBadge}>Indian Standard</span>
                </div>
              </div>

              {/* Enhance panel */}
              <EnhancePanel />

              <button
                className={styles.applyBtn}
                onClick={handleApplyEnhancement}
                disabled={processing}
              >
                {processing ? <span className="spinner" /> : null}
                {processing ? 'Applying…' : 'Apply Enhancement'}
              </button>
            </div>
          )}
        </div>

        {/* Right: options */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <PersonDetails />
          </div>
          <div className={styles.card}>
            <AdvancedOptions />
          </div>

          <div className={styles.navRow}>
            <button className={styles.backBtn} onClick={() => setStep('upload')}>
              <ArrowLeft size={16} /> Back
            </button>
            <button
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={!croppedImageUrl || processing}
            >
              {processing ? <span className="spinner" style={{ borderTopColor: 'white' }} /> : null}
              Preview Sheet <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
