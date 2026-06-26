import PineTreeAsset from '../assets/PineTreeAsset.jsx';
import Farmer from './Farmer.jsx';
import Chick from './Chick.jsx';

export default function GameField({ fieldRef, farmers, chicks }) {
  // Static assets with positioning
  const staticAssets = [
    { id: 'tree1', element: <PineTreeAsset scale={1.2} />, x: '15%', y: 180 },
    { id: 'tree2', element: <PineTreeAsset scale={0.8} />, x: '25%', y: 140 },
    { id: 'tree3', element: <PineTreeAsset scale={1.5} />, x: '85%', y: 220 },
    { id: 'tree4', element: <PineTreeAsset scale={1.1} />, x: '75%', y: 150 },
    { id: 'tree5', element: <PineTreeAsset scale={0.9} />, x: '10%', y: 260 },
    { id: 'tree6', element: <PineTreeAsset scale={1.3} />, x: '90%', y: 120 },
  ];

  return (
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
            {[...Array(15)].map((_, i) => (
              <div key={`tf${i}`} className="w-2 h-full bg-amber-800 rounded-sm" />
            ))}
            <div className="absolute top-3 left-0 right-0 h-1 bg-amber-700" />
            <div className="absolute top-5 left-0 right-0 h-1 bg-amber-700" />
          </div>
          {/* Bottom Fence */}
          <div className="absolute bottom-2 left-0 right-0 h-8 flex justify-around opacity-80">
            {[...Array(15)].map((_, i) => (
              <div key={`bf${i}`} className="w-2 h-full bg-amber-800 rounded-sm" />
            ))}
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
        {chicks.map(chick => (
          <Chick key={chick.id} chick={chick} />
        ))}

        {/* Render Farmers */}
        {farmers.map(farmer => (
          <Farmer key={farmer.id} farmer={farmer} />
        ))}
      </div>
    </div>
  );
}
