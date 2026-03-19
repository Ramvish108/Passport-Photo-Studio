import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Edit2, Download, Move, RotateCcw } from 'lucide-react';
import AadhaarEditor from './AadhaarEditor';
import styles from './AadhaarLayout.module.css';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const CARD_W_MM = 85.6;
const CARD_H_MM = 53.98;
const PREVIEW_W = 500;
const MM_TO_PX  = PREVIEW_W / 210;
const CARD_W    = Math.round(CARD_W_MM * MM_TO_PX);
const CARD_H    = Math.round(CARD_H_MM * MM_TO_PX);
const MARGIN    = Math.round(10 * MM_TO_PX);
const PREVIEW_H = Math.round(297 * MM_TO_PX);

const defaultPos = (gap) => ({
  front: { x: Math.round((PREVIEW_W - CARD_W) / 2), y: MARGIN },
  back:  { x: Math.round((PREVIEW_W - CARD_W) / 2), y: MARGIN + CARD_H + Math.round(gap * MM_TO_PX) },
});

export default function AadhaarLayout() {
  const [frontImage, setFrontImage]   = useState(null);
  const [backImage, setBackImage]     = useState(null);
  const [generating, setGenerating]   = useState(false);
  const [gap, setGap]                 = useState(5);
  const [editingSide, setEditingSide] = useState(null);
  const [positions, setPositions]     = useState(defaultPos(5));
  const [sizes, setSizes]             = useState({
    front: { w: CARD_W, h: CARD_H },
    back:  { w: CARD_W, h: CARD_H },
  });

  // Mouse drag state
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);

  // Mobile: which card is "selected" for touch-move
  const [mobileSelected, setMobileSelected] = useState(null); // 'front' | 'back' | null
  const lastTapRef    = useRef({});
  const touchStartRef = useRef(null);

  const sheetRef = useRef(null);

  // ── File handling ──────────────────────────────────────────────────────
  const handleFile = (file, side) => {
    if (!file || !ACCEPTED.some(t => file.type === t)) return;
    const url = URL.createObjectURL(file);
    if (side === 'front') setFrontImage(url);
    else setBackImage(url);
  };

  const handleDrop = (e, side) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0], side);
  };

  const handleEditDone = (croppedUrl) => {
    if (editingSide === 'front') setFrontImage(croppedUrl);
    else setBackImage(croppedUrl);
    setEditingSide(null);
  };

  const resetPositions = () => {
    setPositions(defaultPos(gap));
    setSizes({
      front: { w: CARD_W, h: CARD_H },
      back:  { w: CARD_W, h: CARD_H },
    });
    setMobileSelected(null);
  };

  const handleGapChange = (val) => {
    setGap(val);
    setPositions(prev => ({
      ...prev,
      back: {
        ...prev.back,
        y: prev.front.y + sizes.front.h + Math.round(val * MM_TO_PX),
      },
    }));
  };

  // ── Mouse: drag to move ────────────────────────────────────────────────
  const onMouseDownMove = (e, side) => {
    e.preventDefault();
    const rect = sheetRef.current.getBoundingClientRect();
    setDragging({
      side,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      origX: positions[side].x,
      origY: positions[side].y,
    });
  };

  const onMouseDownResize = (e, side) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = sheetRef.current.getBoundingClientRect();
    setResizing({
      side,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      origW: sizes[side].w,
      origH: sizes[side].h,
    });
  };

  const onMouseMove = useCallback((e) => {
    if (!sheetRef.current) return;
    const rect = sheetRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (dragging) {
      const dx = mx - dragging.startX;
      const dy = my - dragging.startY;
      const newX = Math.max(0, Math.min(PREVIEW_W - sizes[dragging.side].w, dragging.origX + dx));
      const newY = Math.max(0, Math.min(PREVIEW_H - sizes[dragging.side].h, dragging.origY + dy));
      setPositions(prev => ({ ...prev, [dragging.side]: { x: newX, y: newY } }));
    }

    if (resizing) {
      const dx = mx - resizing.startX;
      const dy = my - resizing.startY;
      setSizes(prev => ({
        ...prev,
        [resizing.side]: {
          w: Math.max(60, resizing.origW + dx),
          h: Math.max(40, resizing.origH + dy),
        },
      }));
    }
  }, [dragging, resizing, sizes]);

  const onMouseUp = useCallback(() => {
    setDragging(null);
    setResizing(null);
  }, []);

  // ── Touch: double tap to select, then drag to move ─────────────────────
  const handleDoubleTap = (side) => {
    if (mobileSelected === side) {
      // Second double tap — deselect (release)
      setMobileSelected(null);
    } else {
      // First double tap — select this card
      setMobileSelected(side);
    }
  };

  const onTouchStart = (e, side) => {
    const now = Date.now();
    const last = lastTapRef.current[side] || 0;

    if (now - last < 350) {
      // Double tap detected
      e.preventDefault();
      handleDoubleTap(side);
      lastTapRef.current[side] = 0;
      return;
    }
    lastTapRef.current[side] = now;

    // If this card is selected, start tracking touch for movement
    if (mobileSelected === side) {
      const touch = e.touches[0];
      const rect  = sheetRef.current.getBoundingClientRect();
      touchStartRef.current = {
        side,
        startX: touch.clientX - rect.left,
        startY: touch.clientY - rect.top,
        origX: positions[side].x,
        origY: positions[side].y,
      };
    }
  };

  const onTouchMove = useCallback((e) => {
    if (!touchStartRef.current || !mobileSelected) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect  = sheetRef.current.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    const dx = mx - touchStartRef.current.startX;
    const dy = my - touchStartRef.current.startY;
    const side = touchStartRef.current.side;
    const newX = Math.max(0, Math.min(PREVIEW_W - sizes[side].w, touchStartRef.current.origX + dx));
    const newY = Math.max(0, Math.min(PREVIEW_H - sizes[side].h, touchStartRef.current.origY + dy));
    setPositions(prev => ({ ...prev, [side]: { x: newX, y: newY } }));
  }, [mobileSelected, sizes]);

  const onTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  // Attach touch listeners with passive:false so we can preventDefault
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    sheet.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => sheet.removeEventListener('touchmove', onTouchMove);
  }, [onTouchMove]);

  // ── PDF Download ───────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!frontImage || !backImage) return;
    setGenerating(true);
    try {
      const { generateAadhaarPDF } = await import('../utils/aadhaarPdfUtils');
      const pxToMm = 210 / PREVIEW_W;
      await generateAadhaarPDF(frontImage, backImage, {
        gapMM: gap,
        frontPos: {
          x: positions.front.x * pxToMm,
          y: positions.front.y * pxToMm,
          w: sizes.front.w * pxToMm,
          h: sizes.front.h * pxToMm,
        },
        backPos: {
          x: positions.back.x * pxToMm,
          y: positions.back.y * pxToMm,
          w: sizes.back.w * pxToMm,
          h: sizes.back.h * pxToMm,
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  // ── Editor fullscreen ──────────────────────────────────────────────────
  if (editingSide !== null) {
    return (
      <div style={{ padding: '0 16px' }}>
        <AadhaarEditor
          imageSrc={editingSide === 'front' ? frontImage : backImage}
          side={editingSide}
          onDone={handleEditDone}
          onCancel={() => setEditingSide(null)}
        />
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>

      <div className={styles.header}>
        <h2 className={styles.title}>Aadhaar Card PDF</h2>
        <p className={styles.subtitle}>
          Upload · Edit · Drag to reposition · Resize · Download as A4 PDF
        </p>
      </div>

      <div className={styles.pageLayout}>

        {/* LEFT: controls */}
        <div className={styles.uploadCol}>

          <UploadCard
            label="Front Side"
            image={frontImage}
            onFile={(f) => handleFile(f, 'front')}
            onDrop={(e) => handleDrop(e, 'front')}
            onClear={() => setFrontImage(null)}
            onEdit={() => setEditingSide('front')}
          />

          <UploadCard
            label="Back Side"
            image={backImage}
            onFile={(f) => handleFile(f, 'back')}
            onDrop={(e) => handleDrop(e, 'back')}
            onClear={() => setBackImage(null)}
            onEdit={() => setEditingSide('back')}
          />

          {/* Gap slider */}
          <div className={styles.gapControl}>
            <div className={styles.gapHeader}>
              <span className={styles.gapLabel}>Gap between cards</span>
              <strong className={styles.gapValue}>{gap} mm</strong>
            </div>
            <input
              type="range" min={3} max={30} value={gap}
              onChange={e => handleGapChange(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.gapMarkers}><span>3mm</span><span>30mm</span></div>
          </div>

          {/* Reset */}
          <button className={styles.resetBtn} onClick={resetPositions}>
            <RotateCcw size={14} /> Reset Layout to Default
          </button>

          {/* Help */}
          <div className={styles.helpBox}>
            <p className={styles.helpTitle}>How to adjust</p>
            <ul className={styles.helpList}>
              <li>🖥 <strong>Desktop:</strong> drag card to move · drag orange corner to resize</li>
              <li>📱 <strong>Mobile:</strong> double-tap card to select (glows orange) · drag to move · double-tap again to release</li>
              <li>🔄 <strong>Reset Layout</strong> restores default positions</li>
            </ul>
          </div>

          {/* Download */}
          <button
            className={styles.downloadBtn}
            onClick={handleDownload}
            disabled={!frontImage || !backImage || generating}
          >
            {generating
              ? <span className="spinner" style={{ borderTopColor: 'white' }} />
              : <Download size={18} />}
            {generating ? 'Generating PDF…' : 'Download Aadhaar PDF'}
          </button>

          {(!frontImage || !backImage) && (
            <p className={styles.uploadNote}>Upload both sides to enable download</p>
          )}
        </div>

        {/* RIGHT: A4 preview */}
        <div className={styles.previewCol}>

          {/* Mobile selected indicator */}
          {mobileSelected && (
            <div className={styles.mobileSelBanner}>
              <span>
                ✋ <strong>{mobileSelected === 'front' ? 'Front' : 'Back'}</strong> selected — drag to move · double-tap to release
              </span>
              <button
                className={styles.mobileSelClose}
                onClick={() => setMobileSelected(null)}
              >
                <X size={14} />
              </button>
            </div>
          )}

          <p className={styles.previewLabel}>A4 Sheet Preview</p>

          <div
            ref={sheetRef}
            className={styles.a4Sheet}
            style={{ width: PREVIEW_W, height: PREVIEW_H }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchEnd={onTouchEnd}
          >
            <DraggableCard
              side="front"
              label="FRONT"
              image={frontImage}
              x={positions.front.x}
              y={positions.front.y}
              w={sizes.front.w}
              h={sizes.front.h}
              isDragging={dragging?.side === 'front'}
              isMobileSelected={mobileSelected === 'front'}
              onMouseDownMove={(e) => onMouseDownMove(e, 'front')}
              onMouseDownResize={(e) => onMouseDownResize(e, 'front')}
              onTouchStart={(e) => onTouchStart(e, 'front')}
            />

            <DraggableCard
              side="back"
              label="BACK"
              image={backImage}
              x={positions.back.x}
              y={positions.back.y}
              w={sizes.back.w}
              h={sizes.back.h}
              isDragging={dragging?.side === 'back'}
              isMobileSelected={mobileSelected === 'back'}
              onMouseDownMove={(e) => onMouseDownMove(e, 'back')}
              onMouseDownResize={(e) => onMouseDownResize(e, 'back')}
              onTouchStart={(e) => onTouchStart(e, 'back')}
            />

            <div className={styles.pageFooter}>
              Aadhaar Card · 85.6×53.98mm · A4 · Passport Photo Studio
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Draggable Card ────────────────────────────────────────────────────────

function DraggableCard({
  label, image, x, y, w, h,
  isDragging, isMobileSelected,
  onMouseDownMove, onMouseDownResize, onTouchStart,
}) {
  return (
    <div
      className={`
        ${styles.draggableCard}
        ${isDragging      ? styles.draggingCard  : ''}
        ${isMobileSelected ? styles.mobileSelected : ''}
      `}
      style={{ left: x, top: y, width: w, height: h }}
      onMouseDown={onMouseDownMove}
      onTouchStart={onTouchStart}
    >
      {image ? (
        <img src={image} alt={label} className={styles.cardImg} draggable={false} />
      ) : (
        <div className={styles.cardEmpty}>
          <Upload size={14} color="#bbb" />
          <span>{label}</span>
        </div>
      )}

      <div className={styles.moveHandle}><Move size={12} /></div>
      <span className={styles.cardTag}>{label}</span>

      {/* Mobile double-tap hint */}
      {isMobileSelected && (
        <div className={styles.mobileDragHint}>Drag to move</div>
      )}

      {/* Resize handle */}
      <div
        className={styles.resizeHandle}
        onMouseDown={onMouseDownResize}
      />
    </div>
  );
}

// ─── Upload Card ───────────────────────────────────────────────────────────

function UploadCard({ label, image, onFile, onDrop, onClear, onEdit }) {
  const inputRef = React.useRef(null);
  const [dragOver, setDragOver] = React.useState(false);

  return (
    <div className={styles.uploadCard}>
      <div className={styles.uploadCardHeader}>
        <span className={styles.uploadCardLabel}>{label}</span>
        {image && (
          <div className={styles.uploadCardActions}>
            <button className={styles.editBtn}
              onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              <Edit2 size={13} /> Edit
            </button>
            <button className={styles.removeBtn}
              onClick={(e) => { e.stopPropagation(); onClear(); }}>
              <X size={13} /> Remove
            </button>
          </div>
        )}
      </div>

      <div
        className={`${styles.dropzone} ${dragOver ? styles.dragOver : ''}`}
        onDrop={(e) => { setDragOver(false); onDrop(e); }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !image && inputRef.current?.click()}
      >
        <input ref={inputRef} type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={(e) => onFile(e.target.files[0])} />

        {image ? (
          <img src={image} alt={label} className={styles.uploadedImg} />
        ) : (
          <div className={styles.dropContent}>
            <Upload size={20} color="var(--accent)" />
            <span className={styles.dropText}>Click or drag & drop</span>
            <span className={styles.dropHint}>JPEG · PNG · WebP</span>
          </div>
        )}
      </div>
    </div>
  );
}