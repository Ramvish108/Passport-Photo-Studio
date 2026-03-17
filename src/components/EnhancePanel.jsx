import React from 'react';
import { Sparkles } from 'lucide-react';
import { usePhotoStore } from '../store/photoStore';
import { ENHANCE_PRESETS } from '../constants';
import styles from './EnhancePanel.module.css';

export default function EnhancePanel() {
  const {
    enhancePreset, setEnhancePreset,
    manualBrightness, setManualBrightness,
    manualContrast, setManualContrast,
    manualSaturation, setManualSaturation,
  } = usePhotoStore();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Sparkles size={15} />
        <span>Enhance</span>
      </div>

      <div className={styles.presets}>
        {ENHANCE_PRESETS.map(p => (
          <button
            key={p.value}
            className={`${styles.presetBtn} ${enhancePreset === p.value ? styles.active : ''}`}
            onClick={() => setEnhancePreset(p.value)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {enhancePreset === 'none' && (
        <div className={styles.sliders}>
          <SliderRow label="Brightness" value={manualBrightness} min={50} max={150} onChange={setManualBrightness} />
          <SliderRow label="Contrast"   value={manualContrast}   min={50} max={150} onChange={setManualContrast} />
          <SliderRow label="Saturation" value={manualSaturation} min={0}  max={200} onChange={setManualSaturation} />
        </div>
      )}
    </div>
  );
}

function SliderRow({ label, value, min, max, onChange }) {
  return (
    <div className={styles.sliderRow}>
      <span className={styles.sliderLabel}>{label}</span>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.sliderValue}>{value}</span>
    </div>
  );
}
