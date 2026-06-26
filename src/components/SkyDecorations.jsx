import { Sun, Cloud } from 'lucide-react';

export default function SkyDecorations() {
  return (
    <>
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
    </>
  );
}
