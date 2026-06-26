import { Camera, X, RefreshCw } from 'lucide-react';

export default function CameraModal({
  isOpen,
  videoRef,
  error,
  onTakePhoto,
  onClose,
  onRetry,
  isLoading
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-emerald-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] p-6 w-full max-w-md flex flex-col items-center shadow-2xl relative border-4 border-emerald-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full p-2 transition-colors"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <h2 className="text-emerald-900 text-2xl font-black mb-6 flex items-center gap-2">
          <Camera className="text-emerald-500" strokeWidth={3} /> Say Cheese!
        </h2>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-center mb-6 w-full border-2 border-red-100">
            <p className="font-bold">{error}</p>
            <button
              onClick={onRetry}
              className="mt-4 flex items-center justify-center gap-2 text-white font-bold bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl mx-auto transition-colors shadow-sm"
            >
              <RefreshCw size={18} /> Try Again
            </button>
          </div>
        ) : (
          <div className="relative w-full aspect-square bg-emerald-50 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center shadow-inner border-4 border-emerald-100">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={() => {
                // Ensure video plays after metadata loads
                if (videoRef.current) {
                  videoRef.current.play().catch(err => console.warn("Video play error:", err));
                }
              }}
              className="absolute min-w-full min-h-full object-cover transform scale-x-[-1]"
            />
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
          onClick={onTakePhoto}
          disabled={!!error || isLoading}
          className={`w-full py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-none ${
            error || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-yellow-400 hover:bg-yellow-300 text-yellow-950 shadow-yellow-600/20'
          }`}
        >
          <span className="text-2xl">✨</span> Create Farmer
        </button>
      </div>
    </div>
  );
}
