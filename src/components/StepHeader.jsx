import React from 'react';
import { Upload, Sliders, Eye } from 'lucide-react';
import { usePhotoStore } from '../store/photoStore';
import styles from './StepHeader.module.css';

const STEPS = [
  { key: 'upload', label: 'Upload',  icon: Upload },
  { key: 'edit',   label: 'Edit',    icon: Sliders },
  { key: 'preview',label: 'Preview', icon: Eye },
];

export default function StepHeader() {
  const { step, croppedImageUrl, setStep } = usePhotoStore();

  const currentIdx = STEPS.findIndex(s => s.key === step);

  const canGo = (key) => {
    if (key === 'upload') return true;
    if (key === 'edit') return !!croppedImageUrl || step === 'edit' || step === 'preview';
    if (key === 'preview') return !!croppedImageUrl;
    return false;
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>⬡</span>
        <span className={styles.brandName}>Passport Photo Studio</span>
      </div>

      <nav className={styles.steps}>
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = s.key === step;
          const done = i < currentIdx;
          const clickable = canGo(s.key);

          return (
            <React.Fragment key={s.key}>
              <button
                className={`${styles.step} ${active ? styles.active : ''} ${done ? styles.done : ''} ${!clickable ? styles.disabled : ''}`}
                onClick={() => clickable && setStep(s.key)}
                disabled={!clickable}
              >
                <span className={styles.stepIcon}><Icon size={14} /></span>
                <span className={styles.stepLabel}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <span className={`${styles.connector} ${done ? styles.connectorDone : ''}`} />
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
}
