import React from 'react';
import { Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { usePhotoStore } from '../store/photoStore';
import { BORDER_STYLES, BG_OPTIONS, PHOTO_COUNT_OPTIONS } from '../constants';
import styles from './AdvancedOptions.module.css';

export default function AdvancedOptions() {
  const {
    showAdvanced, setShowAdvanced,
    borderStyle, setBorderStyle,
    borderColor, setBorderColor,
    bgColor, setBgColor,
    photoCount, setPhotoCount,
    showCutLines, setShowCutLines,
    dpi, setDpi,
  } = usePhotoStore();

  return (
    <div className={styles.panel}>
      <button
        className={styles.toggleHeader}
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <div className={styles.headerLeft}>
          <Settings2 size={15} />
          <span>Advanced Options</span>
        </div>
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showAdvanced && (
        <div className={styles.content}>

          {/* Photo count */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Photos per Sheet</label>
            <div className={styles.countRow}>
              {PHOTO_COUNT_OPTIONS.map(n => (
                <button
                  key={n}
                  className={`${styles.countBtn} ${photoCount === n ? styles.active : ''}`}
                  onClick={() => setPhotoCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Border style */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Border</label>
            <div className={styles.borderRow}>
              {BORDER_STYLES.map(b => (
                <button
                  key={b.value}
                  className={`${styles.borderBtn} ${borderStyle === b.value ? styles.active : ''}`}
                  onClick={() => { setBorderStyle(b.value); if (b.color !== 'transparent') setBorderColor(b.color); }}
                >
                  <span
                    className={styles.borderPreview}
                    style={{
                      border: b.value === 'none' ? '1px dashed #ccc' : `${b.width + 1}px solid ${b.color}`,
                      background: b.color === '#ffffff' ? '#eee' : 'transparent',
                    }}
                  />
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Border color */}
          {borderStyle !== 'none' && (
            <div className={styles.section}>
              <label className={styles.sectionLabel}>Border Colour</label>
              <div className={styles.colorRow}>
                {['#1a1410','#333333','#555555','#0a1a3a','#1a0a0a'].map(c => (
                  <button
                    key={c}
                    className={`${styles.colorSwatch} ${borderColor === c ? styles.swatchActive : ''}`}
                    style={{ background: c }}
                    onClick={() => setBorderColor(c)}
                    aria-label={c}
                  />
                ))}
                <input
                  type="color"
                  value={borderColor}
                  onChange={e => setBorderColor(e.target.value)}
                  className={styles.colorPicker}
                  title="Custom colour"
                />
              </div>
            </div>
          )}

          {/* Background */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Sheet Background</label>
            <div className={styles.bgRow}>
              {BG_OPTIONS.map(b => (
                <button
                  key={b.value}
                  className={`${styles.bgBtn} ${bgColor === b.value ? styles.active : ''}`}
                  style={{ background: b.value, border: bgColor === b.value ? '2px solid var(--accent)' : '1px solid var(--border)' }}
                  onClick={() => setBgColor(b.value)}
                  title={b.label}
                />
              ))}
            </div>
          </div>

          {/* Cut lines */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Cut Lines on PDF</label>
            <div className={styles.checkRow}>
              <input
                type="checkbox"
                id="cutlines"
                checked={showCutLines}
                onChange={e => setShowCutLines(e.target.checked)}
                className={styles.checkbox}
              />
              <label htmlFor="cutlines" className={styles.checkLabel}>
                Show dashed cut lines between photos
              </label>
            </div>
          </div>

          {/* DPI */}
          <div className={styles.section}>
            <label className={styles.sectionLabel}>Print Resolution</label>
            <div className={styles.dpiRow}>
              {[150, 300, 600].map(d => (
                <button
                  key={d}
                  className={`${styles.dpiBtn} ${dpi === d ? styles.active : ''}`}
                  onClick={() => setDpi(d)}
                >
                  {d} DPI
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
