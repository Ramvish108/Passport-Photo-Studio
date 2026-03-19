import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import {
  RotateCcw, RotateCw, ZoomIn, ZoomOut,
  Check, X, Sun, Contrast, Droplets,
  FlipHorizontal, FlipVertical
} from 'lucide-react';
import styles from './AadhaarEditor.module.css';

const AADHAAR_ASPECT = 85.6 / 53.98;

export default function AadhaarEditor({ imageSrc, side, onDone, onCancel }) {
  const [crop, setCrop]             = useState({ x: 0, y: 0 });
  const [zoom, setZoom]             = useState(1);
  const [rotation, setRotation]     = useState(0);
  const [flipH, setFlipH]           = useState(false);
  const [flipV, setFlipV]           = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast]     = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [croppedPixels, setCroppedPixels] = useState(null);
  const [processing, setProcessing]       = useState(false);
  const [activeTab, setActiveTab]         = useState('crop');

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedPixels(pixels);
  }, []);

  const handleDone = async () => {
    if (!croppedPixels) return;
    setProcessing(true);
    try {
      const result = await getCroppedImage(
        imageSrc, croppedPixels,
        rotation, flipH, flipV,
        brightness, contrast, saturation
      );
      onDone(result);
    } catch (e) {
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const handleResetAdjust = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  return (
    <div className={styles.editorWrapper}>

      {/* Header */}
      <div className={styles.editorHeader}>
        <h3 className={styles.editorTitle}>
          Edit — {side === 'front' ? 'Front Side' : 'Back Side'}
        </h3>
        <button className={styles.cancelBtn} onClick={onCancel}>
          <X size={16} /> Cancel
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'crop' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('crop')}
        >
          Crop & Rotate
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'adjust' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('adjust')}
        >
          Adjust Colors
        </button>
      </div>

      {/* Crop Preview */}
      <div className={styles.cropOuter}>
        <div
          className={styles.cropContainer}
          style={{
            transform: `scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={AADHAAR_ASPECT}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                width: '100%',
                height: '100%',
                borderRadius: 0,
              },
              cropAreaStyle: {
                border: '2px solid #c8651a',
              },
              mediaStyle: {
                filter: `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100})`,
              },
            }}
          />
        </div>
      </div>

      {/* Crop & Rotate Tab */}
      {activeTab === 'crop' && (
        <div className={styles.controls}>

          {/* Zoom */}
          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>Zoom</span>
            <button className={styles.iconBtn} onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))}>
              <ZoomOut size={14} />
            </button>
            <input
              type="range" min={1} max={3} step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className={styles.slider}
            />
            <button className={styles.iconBtn} onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))}>
              <ZoomIn size={14} />
            </button>
            <span className={styles.valueLabel}>{zoom.toFixed(1)}x</span>
          </div>

          {/* Rotation */}
          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>Rotate</span>
            <button className={styles.iconBtn} onClick={() => setRotation(r => r - 90)}>
              <RotateCcw size={14} />
            </button>
            <input
              type="range" min={-180} max={180} step={1}
              value={rotation}
              onChange={e => setRotation(Number(e.target.value))}
              className={styles.slider}
            />
            <button className={styles.iconBtn} onClick={() => setRotation(r => r + 90)}>
              <RotateCw size={14} />
            </button>
            <span className={styles.valueLabel}>{rotation}°</span>
          </div>

          {/* Flip */}
          <div className={styles.flipRow}>
            <button
              className={`${styles.flipBtn} ${flipH ? styles.flipActive : ''}`}
              onClick={() => setFlipH(v => !v)}
            >
              <FlipHorizontal size={14} /> Flip Horizontal
            </button>
            <button
              className={`${styles.flipBtn} ${flipV ? styles.flipActive : ''}`}
              onClick={() => setFlipV(v => !v)}
            >
              <FlipVertical size={14} /> Flip Vertical
            </button>
          </div>

          <button className={styles.resetBtn} onClick={handleReset}>
            Reset All
          </button>
        </div>
      )}

      {/* Adjust Colors Tab */}
      {activeTab === 'adjust' && (
        <div className={styles.controls}>

          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>
              <Sun size={13} /> Brightness
            </span>
            <input
              type="range" min={50} max={150} value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.valueLabel}>{brightness}</span>
          </div>

          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>
              <Contrast size={13} /> Contrast
            </span>
            <input
              type="range" min={50} max={150} value={contrast}
              onChange={e => setContrast(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.valueLabel}>{contrast}</span>
          </div>

          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>
              <Droplets size={13} /> Saturation
            </span>
            <input
              type="range" min={0} max={200} value={saturation}
              onChange={e => setSaturation(Number(e.target.value))}
              className={styles.slider}
            />
            <span className={styles.valueLabel}>{saturation}</span>
          </div>

          <button className={styles.resetBtn} onClick={handleResetAdjust}>
            Reset Colors
          </button>
        </div>
      )}

      {/* Apply Button */}
      <button
        className={styles.applyBtn}
        onClick={handleDone}
        disabled={processing}
      >
        {processing
          ? <span className="spinner" style={{ borderTopColor: 'white' }} />
          : <Check size={18} />}
        {processing ? 'Processing…' : 'Apply & Save'}
      </button>

    </div>
  );
}

// ─── Canvas crop utility ───────────────────────────────────────────────────

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', e => reject(e));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = url;
  });
}

async function getCroppedImage(
  imageSrc, pixelCrop,
  rotation, flipH, flipV,
  brightness, contrast, saturation
) {
  const image   = await createImage(imageSrc);
  const canvas  = document.createElement('canvas');
  const ctx     = canvas.getContext('2d');

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width  = safeArea;
  canvas.height = safeArea;

  // Apply transforms
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Apply color adjustments
  ctx.filter = `brightness(${brightness / 100}) contrast(${contrast / 100}) saturate(${saturation / 100})`;

  ctx.drawImage(
    image,
    safeArea / 2 - image.width  / 2,
    safeArea / 2 - image.height / 2
  );

  // Get pixel data for crop
  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // Draw cropped area
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width  = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;
  const cropCtx = cropCanvas.getContext('2d');

  cropCtx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width  / 2 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
  );

  return cropCanvas.toDataURL('image/jpeg', 0.95);
}