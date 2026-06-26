import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { loadFarmState, saveFarmState } from './utils/farmStateStorage.js';
import { isSupabaseConfigured, loadRemoteFarmState, saveRemoteFarmState, subscribeToRemoteFarmState } from './utils/supabaseFarmSync.js';

const getInitialFarmers = () => {
  const savedState = loadFarmState();
  return savedState?.farmers ?? [];
};

const getInitialChicks = () => {
  const savedState = loadFarmState();
  return savedState?.chicks ?? INITIAL_CHICKS;
};

const getInitialNextId = () => {
  const savedState = loadFarmState();
  return savedState?.nextId ?? 1;
};

const getInitialUpdatedAt = () => {
  const savedState = loadFarmState();
  return savedState?.updatedAt ?? 0;
};

export default function App() {
  const [farmers, setFarmers] = useState(getInitialFarmers);
  const [chicks, setChicks] = useState(getInitialChicks);
  const [nickname, setNickname] = useState('');

  const fieldRef = useRef(null);
  const nextId = useRef(getInitialNextId());
  const latestStateRef = useRef({
    farmers: getInitialFarmers(),
    chicks: getInitialChicks(),
    nextId: getInitialNextId(),
    updatedAt: getInitialUpdatedAt()
  });
  const lastRemoteUpdateRef = useRef(0);

  const { isCameraOpen, stream, error, videoRef, openCamera, closeCamera } = useCamera();

  const handleOpenCamera = useCallback(() => {
    setNickname('');
    openCamera();
  }, [openCamera]);

  const handleCloseCamera = useCallback(() => {
    setNickname('');
    closeCamera();
  }, [closeCamera]);

  const getRandomTargetCallback = useCallback(() => {
    return getRandomTarget(fieldRef);
  }, []);

  // Game loop for farmer and chick movement
  useGameLoop(farmers, setFarmers, chicks, setChicks, getRandomTargetCallback, fieldRef);

  useEffect(() => {
    latestStateRef.current = {
      farmers,
      chicks,
      nextId: nextId.current,
      updatedAt: Date.now()
    };
  }, [farmers, chicks]);

  useEffect(() => {
    const saveInterval = window.setInterval(() => {
      saveFarmState(latestStateRef.current);
    }, 2000);

    const remoteSaveInterval = window.setInterval(() => {
      if (!isSupabaseConfigured()) return;

      saveRemoteFarmState({
        farmers: latestStateRef.current.farmers,
        nextId: latestStateRef.current.nextId,
        updatedAt: Date.now()
      });
    }, 5000);

    const handleBeforeUnload = () => {
      saveFarmState(latestStateRef.current);
      if (isSupabaseConfigured()) {
        saveRemoteFarmState({
          farmers: latestStateRef.current.farmers,
          nextId: latestStateRef.current.nextId,
          updatedAt: Date.now()
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.clearInterval(saveInterval);
      window.clearInterval(remoteSaveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      saveFarmState(latestStateRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = null;

    const syncRemoteState = async () => {
      if (!isSupabaseConfigured()) {
        return;
      }

      const remoteState = await loadRemoteFarmState();
      if (cancelled || !remoteState) return;

      const localState = loadFarmState();
      const localUpdatedAt = localState?.updatedAt ?? 0;

      if (remoteState.updatedAt > localUpdatedAt) {
        lastRemoteUpdateRef.current = remoteState.updatedAt;
        nextId.current = remoteState.nextId ?? nextId.current;
        latestStateRef.current = {
          farmers: remoteState.farmers,
          chicks: localState?.chicks ?? INITIAL_CHICKS,
          nextId: nextId.current,
          updatedAt: remoteState.updatedAt
        };
        setFarmers(remoteState.farmers);
      }

      unsubscribe = subscribeToRemoteFarmState(incomingState => {
        if (cancelled || !incomingState) return;
        if (incomingState.updatedAt <= lastRemoteUpdateRef.current) return;

        lastRemoteUpdateRef.current = incomingState.updatedAt;
        nextId.current = incomingState.nextId ?? nextId.current;
        latestStateRef.current = {
          farmers: incomingState.farmers,
          chicks: loadFarmState()?.chicks ?? INITIAL_CHICKS,
          nextId: nextId.current,
          updatedAt: incomingState.updatedAt
        };
        setFarmers(incomingState.farmers);
      });
    };

    syncRemoteState();

    return () => {
      cancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleTakePhoto = () => {
    const imgUrl = capturePhotoFromVideo(videoRef);
    if (!imgUrl) return;

    const newFarmer = createFarmerFromPhoto(
      imgUrl,
      nickname,
      fieldRef,
      nextId,
      getRandomTargetCallback,
      COSTUMES
    );

    setFarmers(prev => {
      const updatedFarmers = [...prev, newFarmer];
      const updatedState = {
        farmers: updatedFarmers,
        chicks,
        nextId: nextId.current,
        updatedAt: Date.now()
      };
      latestStateRef.current = {
        ...updatedState
      };
      saveFarmState(latestStateRef.current);
      if (isSupabaseConfigured()) {
        saveRemoteFarmState({
          farmers: updatedFarmers,
          nextId: nextId.current,
          updatedAt: latestStateRef.current.updatedAt
        });
      }
      return updatedFarmers;
    });
    closeCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
      <SkyDecorations />

      <Header onAddFarmer={handleOpenCamera} />

      <GameField fieldRef={fieldRef} farmers={farmers} chicks={chicks} />

      <CameraModal
        isOpen={isCameraOpen}
        videoRef={videoRef}
        error={error}
        nickname={nickname}
        onNicknameChange={setNickname}
        onTakePhoto={handleTakePhoto}
        onClose={handleCloseCamera}
        onRetry={handleOpenCamera}
      />
    </div>
  );
}
