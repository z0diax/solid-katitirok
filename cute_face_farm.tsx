import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, X, Plus, AlertCircle, RefreshCw, Sun, Cloud } from 'lucide-react';

// --- CUTE GAME ASSETS (Inline SVGs acting as external assets) ---

const PineTreeAsset = ({ scale = 1 }) => (
  <div className="relative drop-shadow-xl" style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
    <svg width="120" height="180" viewBox="0 0 120 180" className="overflow-visible">
      {/* Base Shadow */}
      <ellipse cx="60" cy="170" rx="35" ry="10" fill="rgba(0,0,0,0.2)" filter="blur(3px)" />
      
      {/* Trunk */}
      <path d="M 52 140 L 68 140 L 68 175 L 52 175 Z" fill="#78350f" />
      <path d="M 52 140 L 60 140 L 60 175 L 52 175 Z" fill="#92400e" />
      
      {/* Leaves - Bottom Layer */}
      <path d="M 10 150 Q 60 145 110 150 L 60 70 Z" fill="#065f46" stroke="#022c22" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 60 147 L 105 147 L 60 75 Z" fill="#064e3b" opacity="0.3" /> {/* Internal Shading */}
      
      {/* Leaves - Middle Layer */}
      <path d="M 20 110 Q 60 105 100 110 L 60 40 Z" fill="#059669" stroke="#064e3b" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 60 107 L 95 107 L 60 45 Z" fill="#047857" opacity="0.3" /> {/* Internal Shading */}
      
      {/* Leaves - Top Layer */}
      <path d="M 30 70 Q 60 65 90 70 L 60 10 Z" fill="#10b981" stroke="#047857" strokeWidth="3" strokeLinejoin="round" />
      <path d="M 60 67 L 85 67 L 60 15 Z" fill="#059669" opacity="0.3" /> {/* Internal Shading */}
    </svg>
  </div>
);

// --- APP LOGIC ---

const COSTUMES = [
  { shirt: '#ef4444', overalls: '#2563eb', hatBand: '#dc2626' },
  { shirt: '#eab308', overalls: '#4f46e5', hatBand: '#ca8a04' },
  { shirt: '#10b981', overalls: '#7c3aed', hatBand: '#059669' },
  { shirt: '#f97316', overalls: '#0d9488', hatBand: '#ea580c' },
  { shirt: '#f472b6', overalls: '#0284c7', hatBand: '#db2777' },
];

export default function App() {
  const [farmers, setFarmers] = useState([]);
  const [chicks, setChicks] = useState([
    { id: 'chick1', type: 'chick', x: 200, y: 300, tx: 250, ty: 350, speed: 0.8, state: 'walking', animTime: 0, waitTime: 0 },
    { id: 'chick2', type: 'chick', x: 250, y: 280, tx: 200, ty: 300, speed: 1.0, state: 'idle', animTime: 0, waitTime: 2000 }
  ]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  
  const videoRef = useRef(null);
  const fieldRef = useRef(null);
  const nextId = useRef(1);

  const getRandomTarget = useCallback(() => {
    if (!fieldRef.current) return { tx: 0, ty: 0 };
    const { width, height } = fieldRef.current.getBoundingClientRect();
    const padding = 60; 
    return {
      tx: padding + Math.random() * (width - padding * 2),
      ty: padding + Math.random() * (height - padding * 2)
    };
  }, []);

  // Main game loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Move Farmers
      setFarmers(currentFarmers => {
        if (currentFarmers.length === 0) return currentFarmers;
        return currentFarmers.map(farmer => {
          let { x, y, tx, ty, speed, animationTime, state, idleTimeLeft } = farmer;

          if (state === 'idle') {
            idleTimeLeft -= 30;
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
          const dist = Math.hypot(dx, dy);

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

          if (fieldRef.current) {
             const { width, height } = fieldRef.current.getBoundingClientRect();
             x = Math.max(40, Math.min(x, width - 40));
             y = Math.max(40, Math.min(y, height - 40));
          }

          animationTime += 0.15;
          return { ...farmer, x, y, tx, ty, animationTime, state, idleTimeLeft };
        });
      });

      // Move Chicks
      setChicks(currentChicks => {
        return currentChicks.map(chick => {
          let { x, y, tx, ty, speed, animTime, state, waitTime } = chick;
          
          if (state === 'idle') {
            waitTime -= 30;
            if (waitTime <= 0) {
              state = 'walking';
              const target = getRandomTarget();
              tx = target.tx; ty = target.ty;
            }
            animTime += 0.05;
          } else {
            const dx = tx - x; const dy = ty - y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 5) {
              state = 'idle';
              waitTime = 500 + Math.random() * 2000;
            } else {
              x += Math.cos(Math.atan2(dy, dx)) * speed;
              y += Math.sin(Math.atan2(dy, dx)) * speed;
            }
            animTime += 0.2;
          }
          return { ...chick, x, y, tx, ty, animTime, state, waitTime };
        });
      });
    }, 30);

    return () => clearInterval(interval);
  }, [getRandomTarget]);

  const openCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = mediaStream; }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const closeCamera = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size; canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;
    
    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
    const imgUrl = canvas.toDataURL('image/jpeg');
    
    let initialX = 100; let initialY = 100;
    if (fieldRef.current) {
       const { width, height } = fieldRef.current.getBoundingClientRect();
       initialX = width / 2; initialY = height / 2;
    }

    const newFarmer = {
      id: `farmer_${nextId.current++}`,
      type: 'farmer',
      imgUrl,
      x: initialX,
      y: initialY,
      ...getRandomTarget(),
      speed: 1.0 + Math.random() * 1.5,
      animationTime: Math.random() * Math.PI * 2,
      state: 'walking',
      idleTimeLeft: 0,
      costume: COSTUMES[Math.floor(Math.random() * COSTUMES.length)],
      hatTilt: (Math.random() - 0.5) * 20
    };

    setFarmers(prev => [...prev, newFarmer]);
    closeCamera();
  };

  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(track => track.stop()); };
  }, [stream]);

  // Combine static assets and dynamic entities for Z-index sorting
  // The 'y' value determines the z-index so they overlap correctly.
  const staticAssets = [
    { id: 'tree1', type: 'asset', element: <PineTreeAsset scale={1.2} />, x: '15%', y: 180 },
    { id: 'tree2', type: 'asset', element: <PineTreeAsset scale={0.8} />, x: '25%', y: 140 },
    { id: 'tree3', type: 'asset', element: <PineTreeAsset scale={1.5} />, x: '85%', y: 220 },
    { id: 'tree4', type: 'asset', element: <PineTreeAsset scale={1.1} />, x: '75%', y: 150 },
    { id: 'tree5', type: 'asset', element: <PineTreeAsset scale={0.9} />, x: '10%', y: 260 },
    { id: 'tree6', type: 'asset', element: <PineTreeAsset scale={1.3} />, x: '90%', y: 120 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 to-sky-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans overflow-hidden">
      
      {/* Sky Decor */}
      <div className="fixed top-10 left-10 text-yellow-300 animate-[spin_60s_linear_infinite] opacity-90 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]">
        <Sun size={140} fill="currentColor" />
      </div>
      <div className="fixed top-16 right-[15%] text-white/90 drop-shadow-md animate-[pulse_5s_ease-in-out_infinite_alternate]">
        <Cloud size={120} fill="currentColor" />
      </div>
      <div className="fixed top-48 left-[30%] text-white/70 drop-shadow-sm animate-[bounce_8s_ease-in-out_infinite_alternate]">
        <Cloud size={80} fill="currentColor" />
      </div>

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-end mb-6 relative z-10">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-amber-900 tracking-tight drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            Katitirok 2026
          </h1>
        </div>
        <button 
          onClick={openCamera}
          className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-3xl font-black text-lg shadow-[0_8px_0_rgb(4,120,87)] hover:shadow-[0_4px_0_rgb(4,120,87)] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2 flex items-center gap-3 border-2 border-emerald-400"
        >
          <Camera size={24} strokeWidth={3} />
          <span className="hidden sm:inline">Add Farmer</span>
        </button>
      </div>

      {/* Main Farm Field Container */}
      <div className="relative w-full max-w-5xl aspect-[4/3] sm:h-[65vh] p-4 bg-[#b48050] rounded-[3rem] shadow-2xl border-b-[16px] border-amber-900 flex items-center justify-center">
        
        {/* The Grassy Play Area */}
        <div 
          ref={fieldRef}
          className="relative w-full h-full bg-[#8bc34a] rounded-[2rem] overflow-hidden cursor-crosshair shadow-[inset_0_8px_30px_rgba(0,0,0,0.15)]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #81b942 25%, transparent 25%, transparent 75%, #81b942 75%, #81b942),
              linear-gradient(45deg, #81b942 25%, transparent 25%, transparent 75%, #81b942 75%, #81b942)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        >
          {/* Fences around the border */}
          <div className="absolute inset-0 pointer-events-none z-[1]">
             {/* Top Fence */}
             <div className="absolute top-2 left-0 right-0 h-8 flex justify-around opacity-80">
                {[...Array(15)].map((_,i) => <div key={`tf${i}`} className="w-2 h-full bg-amber-800 rounded-sm" />)}
                <div className="absolute top-3 left-0 right-0 h-1 bg-amber-700" />
                <div className="absolute top-5 left-0 right-0 h-1 bg-amber-700" />
             </div>
             {/* Bottom Fence */}
             <div className="absolute bottom-2 left-0 right-0 h-8 flex justify-around opacity-80">
                {[...Array(15)].map((_,i) => <div key={`bf${i}`} className="w-2 h-full bg-amber-800 rounded-sm" />)}
                <div className="absolute top-3 left-0 right-0 h-1 bg-amber-700" />
                <div className="absolute top-5 left-0 right-0 h-1 bg-amber-700" />
             </div>
          </div>

          {/* Dirt path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-[2]">
             <path d="M 0 200 Q 300 250 500 150 T 1000 300" fill="none" stroke="#6b4226" strokeWidth="40" strokeLinecap="round" />
          </svg>

          {/* Render Static Assets */}
          {staticAssets.map(asset => (
             <div 
               key={asset.id} 
               className="absolute transform -translate-x-1/2 -translate-y-full"
               style={{ 
                 left: asset.x, 
                 top: typeof asset.y === 'number' ? `${asset.y}px` : asset.y,
                 zIndex: typeof asset.y === 'number' ? asset.y : 999 
               }}
             >
               {asset.element}
             </div>
          ))}

          {/* Render Chicks */}
          {chicks.map(chick => {
             const isWalking = chick.state === 'walking';
             const isGoingLeft = chick.tx < chick.x;
             const bounce = isWalking ? Math.abs(Math.sin(chick.animTime * 3)) * -6 : 0;
             return (
               <div 
                 key={chick.id}
                 className="absolute transition-all duration-[30ms] ease-linear"
                 style={{
                   left: `${chick.x}px`, top: `${chick.y}px`, zIndex: Math.floor(chick.y)
                 }}
               >
                 <div style={{ transform: `translate(-50%, -100%) translateY(${bounce}px) scaleX(${isGoingLeft ? -1 : 1})` }}>
                    <div className="text-2xl drop-shadow-md">🐥</div>
                 </div>
               </div>
             )
          })}

          {/* Render Farmers */}
          {farmers.map(farmer => {
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
                  key={farmer.id}
                  className="absolute transition-all duration-[30ms] ease-linear"
                  style={{
                    left: `${farmer.x}px`,
                    top: `${farmer.y}px`,
                    zIndex: Math.floor(farmer.y) // Dynamic depth sorting!
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
          })}
        </div>
      </div>

      {/* Camera Modal Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 w-full max-w-md flex flex-col items-center shadow-2xl relative border-4 border-emerald-100 animate-in fade-in zoom-in duration-200">
            <button onClick={closeCamera} className="absolute top-4 right-4 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full p-2 transition-colors">
              <X size={24} strokeWidth={3} />
            </button>

            <h2 className="text-emerald-900 text-2xl font-black mb-6 flex items-center gap-2">
              <Camera className="text-emerald-500" strokeWidth={3} /> Say Cheese!
            </h2>

            {error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center mb-6 w-full border-2 border-red-100">
                <p className="font-bold">{error}</p>
                <button onClick={openCamera} className="mt-4 flex items-center justify-center gap-2 text-white font-bold bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl mx-auto transition-colors shadow-sm">
                  <RefreshCw size={18} /> Try Again
                </button>
              </div>
            ) : (
              <div className="relative w-full aspect-square bg-emerald-50 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center shadow-inner border-4 border-emerald-100">
                <video ref={videoRef} autoPlay playsInline muted className="absolute min-w-full min-h-full object-cover transform scale-x-[-1]" />
                <div className="absolute inset-0 z-10 pointer-events-none border-[40px] border-white/80 rounded-full mix-blend-hard-light" />
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                  <div className="w-[75%] h-[75%] rounded-full border-4 border-dashed border-emerald-500/60 animate-[spin_15s_linear_infinite]" />
                </div>
                <div className="absolute bottom-4 bg-emerald-900/60 backdrop-blur-sm text-white text-sm font-bold px-4 py-1.5 rounded-full z-30">
                  Put your face in the circle!
                </div>
              </div>
            )}

            <button 
              onClick={takePhoto}
              disabled={!!error}
              className={`w-full py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-none ${
                error ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-300 text-yellow-950 shadow-yellow-600/20'
              }`}
            >
              <span className="text-2xl">✨</span> Create Farmer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}