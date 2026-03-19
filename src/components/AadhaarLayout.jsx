import React, { useState, useRef, useCallback } from 'react';
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

// Default positions (centered horizontally, stacked from top)
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
  const [dragging, setDragging]       = useState(null); // { side, startX, startY, origX, origY }
  const [resizing, setResizing]       = useState(null); // { side, startX, startY, origW, origH }
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

  // ── Reset positions ────────────────────────────────────────────────────
  const resetPositions = () => {
    setPositions(defaultPos(gap));
    setSizes({
      front: { w: CARD_W, h: CARD_H },
      back:  { w: CARD_W, h: CARD_H },
    });
  };

  // Update back position when gap slider changes (only if not manually moved)
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

  // ── Drag to move ───────────────────────────────────────────────────────
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
      setPositions(prev => ({
        ...prev,
        [dragging.side]: { x: newX, y: newY },
      }));
    }

    if (resizing) {
      const dx = mx - resizing.startX;
      const dy = my - resizing.startY;
      const newW = Math.max(60, resizing.origW + dx);
      const newH = Math.max(40, resizing.origH + dy);
      setSizes(prev => ({
        ...prev,
        [resizing.side]: { w: newW, h: newH },
      }));
    }
  }, [dragging, resizing, sizes]);

  const onMouseUp = useCallback(() => {
    setDragging(null);
    setResizing(null);
  }, []);

  // ── Resize handle ──────────────────────────────────────────────────────
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

  // ── PDF Download ───────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!frontImage || !backImage) return;
    setGenerating(true);
    try {
      const { generateAadhaarPDF } = await import('../utils/aadhaarPdfUtils');
      // Convert preview px positions/sizes back to mm for PDF
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

          {/* Gap */}
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

          {/* Reset positions */}
          <button className={styles.resetBtn} onClick={resetPositions}>
            <RotateCcw size={14} /> Reset Layout to Default
          </button>

          <div className={styles.helpBox}>
            <p className={styles.helpTitle}>How to adjust:</p>
            <ul className={styles.helpList}>
              <li>🖱 <strong>Drag</strong> cards on the preview to reposition</li>
              <li>↔ <strong>Drag corner handle</strong> to resize</li>
              <li>🔄 Use <strong>Reset Layout</strong> to go back to default</li>
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

        {/* RIGHT: A4 preview with drag */}
        <div className={styles.previewCol}>
          <div className={styles.previewTopBar}>
            <p className={styles.previewLabel}>A4 Sheet Preview — drag cards to reposition</p>
          </div>

          <div
            ref={sheetRef}
            className={styles.a4Sheet}
            style={{ width: PREVIEW_W, height: PREVIEW_H }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >

            {/* Front card */}
            <DraggableCard
              label="FRONT"
              image={frontImage}
              x={positions.front.x}
              y={positions.front.y}
              w={sizes.front.w}
              h={sizes.front.h}
              onMouseDownMove={(e) => onMouseDownMove(e, 'front')}
              onMouseDownResize={(e) => onMouseDownResize(e, 'front')}
              isDragging={dragging?.side === 'front'}
            />

            {/* Back card */}
            <DraggableCard
              label="BACK"
              image={backImage}
              x={positions.back.x}
              y={positions.back.y}
              w={sizes.back.w}
              h={sizes.back.h}
              onMouseDownMove={(e) => onMouseDownMove(e, 'back')}
              onMouseDownResize={(e) => onMouseDownResize(e, 'back')}
              isDragging={dragging?.side === 'back'}
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

// ─── Draggable Card ───────────────────────────────────────────────────────

function DraggableCard({ label, image, x, y, w, h, onMouseDownMove, onMouseDownResize, isDragging }) {
  return (
    <div
      className={`${styles.draggableCard} ${isDragging ? styles.dragging : ''}`}
      style={{ left: x, top: y, width: w, height: h }}
      onMouseDown={onMouseDownMove}
    >
      {image ? (
        <img src={image} alt={label} className={styles.cardImg} draggable={false} />
      ) : (
        <div className={styles.cardEmpty}>
          <Upload size={14} color="#bbb" />
          <span>{label}</span>
        </div>
      )}

      {/* Move cursor indicator */}
      <div className={styles.moveHandle}>
        <Move size={12} />
      </div>

      {/* Card label */}
      <span className={styles.cardTag}>{label}</span>

      {/* Resize handle — bottom right corner */}
      <div
        className={styles.resizeHandle}
        onMouseDown={onMouseDownResize}
      />
    </div>
  );
}

// ─── Upload Card ──────────────────────────────────────────────────────────

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