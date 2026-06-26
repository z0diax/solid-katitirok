import { useEffect } from 'react';
import { distance, clampPositionToBounds } from '../utils/gameHelpers.js';

export const useGameLoop = (
  farmers,
  setFarmers,
  chicks,
  setChicks,
  getRandomTarget,
  fieldRef,
  gameLoopInterval = 30
) => {
  useEffect(() => {
    const interval = setInterval(() => {
      // Move Farmers
      setFarmers(currentFarmers => {
        if (currentFarmers.length === 0) return currentFarmers;
        return currentFarmers.map(farmer => {
          let { x, y, tx, ty, speed, animationTime, state, idleTimeLeft } = farmer;

          if (state === 'idle') {
            idleTimeLeft -= gameLoopInterval;
            if (idleTimeLeft <= 0) {
              state = 'walking';
              const newTarget = getRandomTarget();
              tx = newTarget.tx;
              ty = newTarget.ty;
            }
            animationTime += 0.05;
            return { ...farmer, x, y, tx, ty, animationTime, state, idleTimeLeft };
          }

          const dx = tx - x;
          const dy = ty - y;
          const dist = distance(x, y, tx, ty);

          if (dist < 5) {
            if (Math.random() > 0.4) {
              state = 'idle';
              idleTimeLeft = 1000 + Math.random() * 3000;
            } else {
              const newTarget = getRandomTarget();
              tx = newTarget.tx;
              ty = newTarget.ty;
            }
          } else {
            const angle = Math.atan2(dy, dx);
            x += Math.cos(angle) * speed;
            y += Math.sin(angle) * speed;
          }

          const boundedPos = clampPositionToBounds(x, y, fieldRef);
          x = boundedPos.x;
          y = boundedPos.y;

          animationTime += 0.15;
          return { ...farmer, x, y, tx, ty, animationTime, state, idleTimeLeft };
        });
      });

      // Move Chicks
      setChicks(currentChicks => {
        return currentChicks.map(chick => {
          let { x, y, tx, ty, speed, animTime, state, waitTime } = chick;

          if (state === 'idle') {
            waitTime -= gameLoopInterval;
            if (waitTime <= 0) {
              state = 'walking';
              const target = getRandomTarget();
              tx = target.tx;
              ty = target.ty;
            }
            animTime += 0.05;
          } else {
            const dx = tx - x;
            const dy = ty - y;
            const dist = distance(x, y, tx, ty);

            if (dist < 5) {
              state = 'idle';
              waitTime = 500 + Math.random() * 2000;
            } else {
              const angle = Math.atan2(dy, dx);
              x += Math.cos(angle) * speed;
              y += Math.sin(angle) * speed;
            }
            animTime += 0.2;
          }

          const boundedPos = clampPositionToBounds(x, y, fieldRef);
          x = boundedPos.x;
          y = boundedPos.y;

          return { ...chick, x, y, tx, ty, animTime, state, waitTime };
        });
      });
    }, gameLoopInterval);

    return () => clearInterval(interval);
  }, [getRandomTarget, setFarmers, setChicks, fieldRef, gameLoopInterval]);
};
