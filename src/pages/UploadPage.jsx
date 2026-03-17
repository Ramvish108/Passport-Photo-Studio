import React from 'react';
import ImageUploader from '../components/ImageUploader';
import styles from './UploadPage.module.css';

export default function UploadPage() {
  return (
    <main className={styles.page}>
      <ImageUploader />
    </main>
  );
}
