export default function Farmer({ farmer }) {
  const isWalking = farmer.state === 'walking';
  const t = farmer.animationTime;
  const bounce = isWalking ? Math.abs(Math.sin(t * 2)) * -12 : Math.sin(t) * -2;
  const waddleAngle = isWalking ? Math.cos(t * 2) * 12 : Math.sin(t * 0.5) * 3;
  const leftFootY = isWalking ? Math.max(0, -Math.sin(t * 2) * 10) : 0;
  const rightFootY = isWalking ? Math.max(0, Math.sin(t * 2) * 10) : 0;
  const isGoingLeft = farmer.tx < farmer.x;
  const scaleX = isGoingLeft ? -1 : 1;
  const shadowScale = isWalking ? 1 + (bounce / 30) : 1;
  const shadowOpacity = isWalking ? 0.4 + (bounce / 40) : 0.4;

  return (
    <div
      className="absolute transition-all duration-[30ms] ease-linear"
      style={{
        left: `${farmer.x}px`,
        top: `${farmer.y}px`,
        zIndex: Math.floor(farmer.y)
      }}
    >
      {/* Dynamic Shadow */}
      <div
        className="absolute top-0 left-0 w-12 h-4 bg-black rounded-[100%] blur-[3px]"
        style={{
          transform: `translate(-50%, -5px) scale(${shadowScale})`,
          opacity: shadowOpacity,
          transition: 'all 0.05s linear'
        }}
      />

      {/* Character Container */}
      <div
        className="absolute bottom-0 left-0 flex flex-col items-center"
        style={{
          transform: `translate(-50%, 0) translateY(${bounce}px) rotate(${waddleAngle}deg) scaleX(${scaleX})`,
          transition: 'transform 0.05s linear'
        }}
      >
        {/* Cute Straw Hat */}
        <div
          className="absolute -top-16 z-30 drop-shadow-xl"
          style={{ transform: `rotate(${farmer.hatTilt}deg) translateY(4px)` }}
        >
          <svg width="60" height="30" viewBox="0 0 60 30" className="overflow-visible">
            <ellipse cx="30" cy="22" rx="28" ry="8" fill="#e6c280" />
            <ellipse cx="30" cy="21" rx="28" ry="8" fill="#facc15" />
            <path d="M 15 20 Q 15 5 30 5 Q 45 5 45 20 Z" fill="#e6c280" />
            <path d="M 15 19 Q 15 4 30 4 Q 45 4 45 19 Z" fill="#facc15" />
            <path d="M 15.5 17 Q 30 22 44.5 17 L 45 20 Q 30 25 15 20 Z" fill={farmer.costume.hatBand} />
          </svg>
        </div>

        {/* The Head / Face */}
        <div className="relative w-[72px] h-[72px] rounded-full border-4 border-white bg-amber-50 shadow-md z-20 flex items-center justify-center overflow-hidden mb-1">
          <img
            src={farmer.imgUrl}
            alt="Farmer Face"
            className="absolute inset-0 w-full h-full object-cover scale-[1.15]"
            draggable="false"
          />
          <div className="absolute bottom-2 left-1 w-4 h-2.5 bg-pink-400/70 rounded-full blur-[1px]" />
          <div className="absolute bottom-2 right-1 w-4 h-2.5 bg-pink-400/70 rounded-full blur-[1px]" />
        </div>

        {/* The Chibi Body */}
        <div className="relative w-14 h-12 -mt-4 z-10 flex flex-col items-center">
          <div className="w-12 h-10 rounded-t-2xl rounded-b-lg absolute top-0" style={{ backgroundColor: farmer.costume.shirt }}></div>

          <div className="w-14 h-8 rounded-b-xl absolute bottom-0 shadow-inner overflow-hidden" style={{ backgroundColor: farmer.costume.overalls }}>
            <div className="absolute top-0 left-2 w-2 h-8 bg-black/10 -rotate-12" />
            <div className="absolute top-0 right-2 w-2 h-8 bg-black/10 rotate-12" />
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-4 bg-black/15 rounded-b-md border-t border-white/20" />
          </div>

          <div className="absolute top-3 left-2 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-yellow-600 shadow-sm" />
          <div className="absolute top-3 right-2 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-yellow-600 shadow-sm" />

          <div
            className="absolute top-4 -left-1 w-3 h-6 rounded-full origin-top border border-black/10"
            style={{ backgroundColor: farmer.costume.shirt, transform: `rotate(${isWalking ? Math.sin(t * 2) * 30 : 10}deg)` }}
          />
          <div
            className="absolute top-4 -right-1 w-3 h-6 rounded-full origin-top border border-black/10"
            style={{ backgroundColor: farmer.costume.shirt, transform: `rotate(${isWalking ? -Math.sin(t * 2) * 30 : -10}deg)` }}
          />
        </div>

        {/* The Feet */}
        <div className="flex gap-3 -mt-1 z-0 relative">
          <div className="w-5 h-4 bg-amber-900 rounded-t-md rounded-b-sm border-b-2 border-amber-950" style={{ transform: `translateY(${leftFootY}px)` }} />
          <div className="w-5 h-4 bg-amber-900 rounded-t-md rounded-b-sm border-b-2 border-amber-950" style={{ transform: `translateY(${rightFootY}px)` }} />
        </div>
      </div>
    </div>
  );
}
