const STORAGE_KEY = 'katitirok-farm-state';

export const loadFarmState = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) return null;

    const parsedState = JSON.parse(rawState);
    if (!parsedState || typeof parsedState !== 'object') return null;

    return parsedState;
  } catch (error) {
    console.warn('Failed to load farm state:', error);
    return null;
  }
};

export const saveFarmState = (state) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save farm state:', error);
  }
};

export const clearFarmState = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};