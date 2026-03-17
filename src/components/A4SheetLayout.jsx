import React, { forwardRef } from 'react';
import PassportPhoto from './PassportPhoto';
import { usePhotoStore } from '../store/photoStore';
import { LAYOUT } from '../constants';
import styles from './A4SheetLayout.module.css';

/**
 * A4 sheet preview — 5 photos per row, starting from top-left margin.
 * Layout mirrors the actual PDF exactly — no centering.
 */
const A4SheetLayout = forwardRef(function A4SheetLayout({ imageUrl }, ref) {
  const { photoCount, bgColor, showCutLines } = usePhotoStore();

  // A4 preview dimensions (scaled down for screen)
  const previewWidth  = 520;
  const previewHeight = Math.round(previewWidth * (297 / 210));

  // Convert mm → preview px
  const mmToPx = previewWidth / 210;
  const photoW = Math.round(35 * mmToPx);
  const photoH = Math.round(45 * mmToPx);
  const margin = Math.round(LAYOUT.MARGIN_MM * mmToPx);
  const gap    = Math.round(LAYOUT.GAP_MM    * mmToPx);

  const cols   = LAYOUT.COLS; // 5
  const photos = Array.from({ length: photoCount });

  return (
    <div className={styles.sheetOuter}>
      <div
        ref={ref}
        className={styles.sheet}
        style={{ width: previewWidth, height: previewHeight, background: bgColor }}
      >
        {/* Grid starts at top-left margin — matches PDF layout */}
        <div
          style={{
            position: 'absolute',
            top:  margin,
            left: margin,
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, ${photoW}px)`,
            gap: `${gap}px`,
          }}
        >
          {photos.map((_, i) => (
            <div
              key={i}
              style={{
                outline:       showCutLines ? '1px dashed #bbb' : 'none',
                outlineOffset: 1,
              }}
            >
              <PassportPhoto imageUrl={imageUrl} size={photoW} />
            </div>
          ))}
        </div>

        {/* Page footer */}
        <div className={styles.pageLabel}>
          35×45mm · A4 · 300 DPI · {photoCount} photos · 5 per row
        </div>
      </div>
    </div>
  );
});

export default A4SheetLayout;