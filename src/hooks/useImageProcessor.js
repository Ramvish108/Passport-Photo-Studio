import { useState, useCallback } from 'react';
import { getCroppedImg, applyFilter, computeFilter } from '../utils/imageUtils';
import { ENHANCE_PRESETS } from '../constants';
import { usePhotoStore } from '../store/photoStore';

export function useImageProcessor() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const {
    originalImageUrl, bgColor,
    setCroppedImage, setEnhancedImage,
    enhancePreset, manualBrightness, manualContrast, manualSaturation,
  } = usePhotoStore();

  const cropImage = useCallback(async (croppedAreaPixels) => {
    if (!originalImageUrl || !croppedAreaPixels) return;
    setProcessing(true);
    setError(null);
    try {
      const cropped = await getCroppedImg(originalImageUrl, croppedAreaPixels, bgColor);
      setCroppedImage(cropped);
      return cropped;
    } catch (e) {
      setError('Failed to crop image. Please try again.');
      console.error(e);
    } finally {
      setProcessing(false);
    }
  }, [originalImageUrl, bgColor, setCroppedImage]);

  const enhanceImage = useCallback(async (imageUrl) => {
    if (!imageUrl) return;
    setProcessing(true);
    try {
      const filter = computeFilter(enhancePreset, manualBrightness, manualContrast, manualSaturation, ENHANCE_PRESETS);
      if (!filter || filter === 'brightness(1) contrast(1) saturate(1)') {
        setEnhancedImage(imageUrl);
        return imageUrl;
      }
      const enhanced = await applyFilter(imageUrl, filter);
      setEnhancedImage(enhanced);
      return enhanced;
    } catch (e) {
      setError('Enhancement failed.');
      console.error(e);
    } finally {
      setProcessing(false);
    }
  }, [enhancePreset, manualBrightness, manualContrast, manualSaturation, setEnhancedImage]);

  return { cropImage, enhanceImage, processing, error };
}
