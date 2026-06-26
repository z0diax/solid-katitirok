export default function PineTreeAsset({ scale = 1 }) {
  return (
    <div 
      className="relative drop-shadow-xl" 
      style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
    >
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
}
