import React from 'react';
import { usePhotoStore } from './store/photoStore';
import StepHeader from './components/StepHeader';
import UploadPage from './pages/UploadPage';
import EditorPage from './pages/EditorPage';
import PreviewPage from './pages/PreviewPage';
import AadhaarLayout from './components/AadhaarLayout';
import AadhaarEditor from './components/AadhaarEditor';

export default function App() {
  const { step } = usePhotoStore();
  const [mode, setMode] = React.useState('passport');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <StepHeader />

      {/* Mode switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        padding: '14px 16px 0',
        background: 'var(--cream)',
      }}>
        <button
          onClick={() => setMode('passport')}
          style={{
            padding: '8px 24px',
            borderRadius: 24,
            border: '1.5px solid',
            borderColor: mode === 'passport' ? 'var(--accent)' : 'var(--border)',
            background: mode === 'passport' ? 'var(--accent)' : 'var(--white)',
            color: mode === 'passport' ? 'white' : 'var(--ink-muted)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          Passport Photo
        </button>
        <button
          onClick={() => setMode('aadhaar')}
          style={{
            padding: '8px 24px',
            borderRadius: 24,
            border: '1.5px solid',
            borderColor: mode === 'aadhaar' ? 'var(--accent)' : 'var(--border)',
            background: mode === 'aadhaar' ? 'var(--accent)' : 'var(--white)',
            color: mode === 'aadhaar' ? 'white' : 'var(--ink-muted)',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          Aadhaar Card
        </button>
      </div>

      {/* Pages */}
      {mode === 'passport' && (
        <>
          {step === 'upload'  && <UploadPage />}
          {step === 'edit'    && <EditorPage />}
          {step === 'preview' && <PreviewPage />}
        </>
      )}

      {mode === 'aadhaar' && (
        <div style={{ padding: '0 16px 40px' }}>
          <AadhaarLayout />
        </div>
      )}
    </div>
  );
}