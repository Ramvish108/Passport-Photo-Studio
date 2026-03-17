import React from 'react';
import { usePhotoStore } from '../store/photoStore';
import { ENHANCE_PRESETS, BORDER_STYLES } from '../constants';
import { computeFilter } from '../utils/imageUtils';
import styles from './PassportPhoto.module.css';

/**
 * A single passport photo tile — used both in the preview grid and as a standalone preview.
 */
export default function PassportPhoto({ imageUrl, size = 120 }) {
  const {
    enhancePreset, manualBrightness, manualContrast, manualSaturation,
    borderStyle, borderColor,
    showDetails, personName, personDob,
  } = usePhotoStore();

  const filter = computeFilter(enhancePreset, manualBrightness, manualContrast, manualSaturation, ENHANCE_PRESETS);
  const borderDef = BORDER_STYLES.find(b => b.value === borderStyle) || BORDER_STYLES[0];
  const borderWidth = borderDef.value === 'none' ? 0 : borderDef.width;

  // Maintain 35:45 aspect ratio
  const width = size;
  const height = Math.round(size * (45 / 35));

  return (
    <div className={styles.wrapper} style={{ width, flexShrink: 0 }}>
      <div
        className={styles.photo}
        style={{
          width,
          height,
          border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor}` : 'none',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Passport photo"
            className={styles.img}
            style={{ filter: filter || undefined }}
          />
        ) : (
          <div className={styles.placeholder} style={{ height }} />
        )}
      </div>
      {showDetails && (personName || personDob) && (
        <div className={styles.details} style={{ width }}>
          {personName && <span className={styles.name}>{personName.toUpperCase()}</span>}
          {personDob && <span className={styles.dob}>DOB: {personDob}</span>}
        </div>
      )}
    </div>
  );
}
