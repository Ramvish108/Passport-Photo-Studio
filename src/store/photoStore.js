import { create } from 'zustand';

export const usePhotoStore = create((set) => ({
  // Step tracking
  step: 'upload',
  setStep: (step) => set({ step }),

  // Image data
  originalImage: null,
  originalImageUrl: null,
  croppedImageUrl: null,
  enhancedImageUrl: null,

  setOriginalImage: (file) => {
    const url = URL.createObjectURL(file);
    set({ originalImage: file, originalImageUrl: url, croppedImageUrl: null, enhancedImageUrl: null });
  },
  setCroppedImage: (dataUrl) => set({ croppedImageUrl: dataUrl, enhancedImageUrl: dataUrl }),
  setEnhancedImage: (dataUrl) => set({ enhancedImageUrl: dataUrl }),

  // Person details
  personName: '',
  personDob: '',
  setPersonName: (name) => set({ personName: name }),
  setPersonDob:  (dob)  => set({ personDob: dob }),
  showDetails: false,
  setShowDetails: (v) => set({ showDetails: v }),

  // Layout
  photoCount: 10,          // default: 10 (2 rows of 5)
  setPhotoCount: (n) => set({ photoCount: n }),

  // Enhancement
  enhancePreset: 'none',
  setEnhancePreset: (preset) => set({ enhancePreset: preset }),
  manualBrightness: 100,
  manualContrast:   100,
  manualSaturation: 100,
  setManualBrightness: (v) => set({ manualBrightness: v }),
  setManualContrast:   (v) => set({ manualContrast: v }),
  setManualSaturation: (v) => set({ manualSaturation: v }),

  // Border
  borderStyle: 'thin',
  borderColor: '#1a1410',
  setBorderStyle: (s) => set({ borderStyle: s }),
  setBorderColor: (c) => set({ borderColor: c }),

  // Background
  bgColor: '#ffffff',
  setBgColor: (c) => set({ bgColor: c }),

  // Advanced
  showAdvanced: false,
  setShowAdvanced: (v) => set({ showAdvanced: v }),
  dpi: 300,
  setDpi: (v) => set({ dpi: v }),
  showCutLines: true,
  setShowCutLines: (v) => set({ showCutLines: v }),

  // Reset
  reset: () => set({
    step: 'upload',
    originalImage: null, originalImageUrl: null,
    croppedImageUrl: null, enhancedImageUrl: null,
    personName: '', personDob: '',
    showDetails: false,
    photoCount: 10,
    enhancePreset: 'none',
    manualBrightness: 100, manualContrast: 100, manualSaturation: 100,
    borderStyle: 'thin', borderColor: '#1a1410',
    bgColor: '#ffffff',
    showAdvanced: false,
    showCutLines: true,
  }),
}));