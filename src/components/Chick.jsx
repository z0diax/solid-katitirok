export default function Chick({ chick }) {
  const isWalking = chick.state === 'walking';
  const isGoingLeft = chick.tx < chick.x;
  const bounce = isWalking ? Math.abs(Math.sin(chick.animTime * 3)) * -6 : 0;

  return (
    <div
      className="absolute transition-all duration-[30ms] ease-linear"
      style={{
        left: `${chick.x}px`,
        top: `${chick.y}px`,
        zIndex: Math.floor(chick.y)
      }}
    >
      <div style={{ transform: `translate(-50%, -100%) translateY(${bounce}px) scaleX(${isGoingLeft ? -1 : 1})` }}>
        <div className="text-2xl drop-shadow-md">🐥</div>
      </div>
    </div>
  );
}
