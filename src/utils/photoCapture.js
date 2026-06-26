/**
 * Capture photo from video and convert to data URL
 */
export const capturePhotoFromVideo = (videoRef) => {
  if (!videoRef.current) return null;

  const video = videoRef.current;
  const canvas = document.createElement('canvas');
  const size = Math.min(video.videoWidth, video.videoHeight);
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  const startX = (video.videoWidth - size) / 2;
  const startY = (video.videoHeight - size) / 2;

  ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
  return canvas.toDataURL('image/jpeg');
};

/**
 * Stop all media streams
 */
export const stopMediaStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};
