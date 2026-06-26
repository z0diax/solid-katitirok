import { Camera } from 'lucide-react';

export default function Header({ onAddFarmer }) {
  return (
    <div className="w-full max-w-5xl flex justify-between items-end mb-6 relative z-10">
      <div>
        <h1 className="text-4xl sm:text-5xl font-black text-amber-900 tracking-tight drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
          Katitirok 2026
        </h1>
      </div>
      <button
        onClick={onAddFarmer}
        className="bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-4 rounded-3xl font-black text-lg shadow-[0_8px_0_rgb(4,120,87)] hover:shadow-[0_4px_0_rgb(4,120,87)] hover:translate-y-1 transition-all active:shadow-none active:translate-y-2 flex items-center gap-3 border-2 border-emerald-400"
      >
        <Camera size={24} strokeWidth={3} />
        <span className="hidden sm:inline">Add Farmer</span>
      </button>
    </div>
  );
}
