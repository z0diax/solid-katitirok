/**
 * Generate a random target position within field boundaries
 */
export const getRandomTarget = (fieldRef) => {
  if (!fieldRef.current) return { tx: 0, ty: 0 };
  const { width, height } = fieldRef.current.getBoundingClientRect();
  const padding = 60;
  return {
    tx: padding + Math.random() * (width - padding * 2),
    ty: padding + Math.random() * (height - padding * 2)
  };
};

/**
 * Clamp position within field boundaries
 */
export const clampPositionToBounds = (x, y, fieldRef, boundaryOffset = 40) => {
  if (!fieldRef.current) return { x, y };
  const { width, height } = fieldRef.current.getBoundingClientRect();
  return {
    x: Math.max(boundaryOffset, Math.min(x, width - boundaryOffset)),
    y: Math.max(boundaryOffset, Math.min(y, height - boundaryOffset))
  };
};

/**
 * Calculate distance between two points
 */
export const distance = (x1, y1, x2, y2) => {
  return Math.hypot(x2 - x1, y2 - y1);
};

/**
 * Create a new farmer object from photo
 */
export const createFarmerFromPhoto = (imgUrl, nickname, fieldRef, nextIdRef, getRandomTargetFn, costumes) => {
  let initialX = 100;
  let initialY = 100;

  if (fieldRef.current) {
    const { width, height } = fieldRef.current.getBoundingClientRect();
    initialX = width / 2;
    initialY = height / 2;
  }

  const newFarmer = {
    id: `farmer_${nextIdRef.current++}`,
    type: 'farmer',
    imgUrl,
    nickname: nickname?.trim() || '',
    x: initialX,
    y: initialY,
    ...getRandomTargetFn(),
    speed: 1.0 + Math.random() * 1.5,
    animationTime: Math.random() * Math.PI * 2,
    state: 'walking',
    idleTimeLeft: 0,
    costume: costumes[Math.floor(Math.random() * costumes.length)],
    hatTilt: (Math.random() - 0.5) * 20
  };

  return newFarmer;
};
