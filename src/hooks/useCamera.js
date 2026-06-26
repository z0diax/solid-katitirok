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
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Set video element stream immediately
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Camera access error:", err);
      const errorMessage = err.name === 'NotAllowedError' 
        ? "Camera permission denied. Please allow camera access in browser settings."
        : err.name === 'NotFoundError'
        ? "No camera device found. Please check your device."
        : "Could not access camera. Please ensure permissions are granted.";
      setError(errorMessage);
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
