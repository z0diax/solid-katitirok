import { useState, useRef, useEffect } from 'react';
import { stopMediaStream } from '../utils/photoCapture.js';

export const useCamera = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const openCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const closeCamera = () => {
    if (stream) {
      stopMediaStream(stream);
    }
    setStream(null);
    setIsCameraOpen(false);
    setError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stopMediaStream(stream);
      }
    };
  }, [stream]);

  return {
    isCameraOpen,
    stream,
    error,
    videoRef,
    openCamera,
    closeCamera
  };
};
