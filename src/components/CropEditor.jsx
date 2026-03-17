import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCcw, ZoomIn, ZoomOut, Check } from 'lucide-react';
import { PASSPORT } from '../constants';
import { usePhotoStore } from '../store/photoStore';
import { useImageProcessor } from '../hooks/useImageProcessor';
import styles from './CropEditor.module.css';

export default function CropEditor({ onDone }) {
  const { originalImageUrl } = usePhotoStore();
  const { cropImage, processing } = useImageProcessor();

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleDone = async () => {
    const result = await cropImage(croppedAreaPixels);
    if (result) onDone?.();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Crop to Passport Size</h2>
        <p className={styles.hint}>35 × 45 mm — centre your face, keep ears visible, white background preferred</p>
      </div>

      <div className={styles.cropContainer}>
        {originalImageUrl && (
          <Cropper
            image={originalImageUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={PASSPORT.ASPECT_RATIO}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            cropShape="rect"
            showGrid
            style={{
              containerStyle: { borderRadius: '12px', overflow: 'hidden' },
              cropAreaStyle: { border: '2px solid #c8651a' },
            }}
          />
        )}
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            <ZoomOut size={14} /> Zoom
          </label>
          <input
            type="range" min={1} max={3} step={0.05}
            value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className={styles.slider}
          />
          <button className={styles.iconBtn} onClick={() => setZoom(z => Math.max(1, z - 0.1))}>
            <ZoomOut size={16} />
          </button>
          <button className={styles.iconBtn} onClick={() => setZoom(z => Math.min(3, z + 0.1))}>
            <ZoomIn size={16} />
          </button>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>
            <RotateCcw size={14} /> Rotate
          </label>
          <input
            type="range" min={-180} max={180} step={1}
            value={rotation}
            onChange={e => setRotation(Number(e.target.value))}
            className={styles.slider}
          />
          <button className={styles.iconBtn} onClick={() => setRotation(0)}>
            <RotateCcw size={16} />
          </button>
          <span className={styles.valueLabel}>{rotation}°</span>
        </div>
      </div>

      <button
        className={styles.doneBtn}
        onClick={handleDone}
        disabled={processing}
      >
        {processing ? <span className="spinner" /> : <Check size={18} />}
        {processing ? 'Processing…' : 'Apply Crop'}
      </button>
    </div>
  );
}
