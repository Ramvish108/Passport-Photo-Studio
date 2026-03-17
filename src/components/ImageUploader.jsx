import React, { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { usePhotoStore } from '../store/photoStore';
import styles from './ImageUploader.module.css';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export default function ImageUploader() {
  const { setOriginalImage, setStep } = usePhotoStore();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback((file) => {
    if (!file) return;
    if (!ACCEPTED.some(t => file.type === t || file.name.toLowerCase().endsWith('.heic'))) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File is too large. Please use an image under 20MB.');
      return;
    }
    setError('');
    setOriginalImage(file);
    setStep('edit');
  }, [setOriginalImage, setStep]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Passport Photo Studio</h1>
        <p className={styles.subtitle}>
          Indian standard 35×45mm · 300 DPI · A4 sheet · Instant PDF
        </p>
      </div>

      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className={styles.hiddenInput}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        <div className={styles.dropContent}>
          <div className={styles.iconRing}>
            {dragging ? <ImageIcon size={32} /> : <Upload size={32} />}
          </div>
          <p className={styles.dropTitle}>
            {dragging ? 'Drop your photo here' : 'Drag & drop your photo'}
          </p>
          <p className={styles.dropHint}>or click to browse — JPEG, PNG, WebP up to 20MB</p>
          <button className={styles.browseBtn} onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}>
            Choose Photo
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.specs}>
        <div className={styles.spec}><span className={styles.specLabel}>Size</span><span>35 × 45 mm</span></div>
        <div className={styles.spec}><span className={styles.specLabel}>Resolution</span><span>300 DPI</span></div>
        <div className={styles.spec}><span className={styles.specLabel}>Format</span><span>A4 sheet PDF</span></div>
        <div className={styles.spec}><span className={styles.specLabel}>Standard</span><span>BIS / GOI</span></div>
      </div>
    </div>
  );
}
