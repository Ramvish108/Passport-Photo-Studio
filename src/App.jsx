import React from 'react';
import { usePhotoStore } from './store/photoStore';
import StepHeader from './components/StepHeader';
import UploadPage from './pages/UploadPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';

export default function App() {
  const { step } = usePhotoStore();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <StepHeader />
      {step === 'upload'  && <UploadPage />}
      {step === 'edit'    && <EditorPage />}
      {step === 'preview' && <PreviewPage />}
    </div>
  );
}
