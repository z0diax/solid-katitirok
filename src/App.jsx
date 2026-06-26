import React, { useState, useRef, useCallback } from 'react';
import Header from './components/Header.jsx';
import GameField from './components/GameField.jsx';
import CameraModal from './components/CameraModal.jsx';
import SkyDecorations from './components/SkyDecorations.jsx';
import { useCamera } from './hooks/useCamera.js';
import { useGameLoop } from './hooks/useGameLoop.js';
import { COSTUMES } from './constants/costumes.js';
import { INITIAL_CHICKS } from './constants/initialChicks.js';
import { getRandomTarget, createFarmerFromPhoto } from './utils/gameHelpers.js';
import { capturePhotoFromVideo } from './utils/photoCapture.js';

export default function App() {
  const [farmers, setFarmers] = useState([]);
  const [chicks, setChicks] = useState(INITIAL_CHICKS);

  const fieldRef = useRef(null);
  const nextId = useRef(1);

  const { isCameraOpen, stream, error, videoRef, openCamera, closeCamera } = useCamera();

  const getRandomTargetCallback = useCallback(() => {
    return getRandomTarget(fieldRef);
  }, []);

  // Game loop for farmer and chick movement
  useGameLoop(farmers, setFarmers, chicks, setChicks, getRandomTargetCallback, fieldRef);

  const handleTakePhoto = () => {
    const imgUrl = capturePhotoFromVideo(videoRef);
    if (!imgUrl) return;

    const newFarmer = createFarmerFromPhoto(
      imgUrl,
      fieldRef,
      nextId,
      getRandomTargetCallback,
      COSTUMES
    );

    setFarmers(prev => [...prev, newFarmer]);
    closeCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
      <SkyDecorations />

      <Header onAddFarmer={openCamera} />

      <GameField fieldRef={fieldRef} farmers={farmers} chicks={chicks} />

      <CameraModal
        isOpen={isCameraOpen}
        videoRef={videoRef}
        error={error}
        onTakePhoto={handleTakePhoto}
        onClose={closeCamera}
        onRetry={openCamera}
      />
    </div>
  );
}
