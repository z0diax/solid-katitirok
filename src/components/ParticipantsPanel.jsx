import { X } from 'lucide-react';

export default function ParticipantsPanel({ farmers, onRemoveFarmer }) {
  const sortedFarmers = [...farmers].slice().reverse();

  return (
    <aside className="w-full xl:w-64 shrink-0 rounded-[2rem] border-4 border-amber-900 bg-white/90 shadow-2xl backdrop-blur-sm p-4">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-black text-emerald-950">Participants</h2>
          <p className="text-xs font-semibold text-emerald-700">{farmers.length} farmers on the field</p>
        </div>
        <div className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-900">
          Live
        </div>
      </div>

      <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
        {sortedFarmers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 px-4 py-5 text-center text-xs font-semibold text-emerald-700">
            No farmers yet. Add one with the camera.
          </div>
        ) : (
          sortedFarmers.map(farmer => (
            <div
              key={farmer.id}
              className="flex items-center gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 shadow-sm"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-md bg-white flex-shrink-0">
                <img
                  src={farmer.imgUrl}
                  alt={farmer.nickname ? `${farmer.nickname} avatar` : 'Farmer avatar'}
                  className="h-full w-full object-cover scale-[1.1]"
                  draggable="false"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-black text-emerald-950">
                  {farmer.nickname || 'Unnamed Farmer'}
                </div>
                <div className="truncate text-[11px] font-semibold text-emerald-700">
                  {farmer.state === 'walking' ? 'Walking the field' : 'Taking a break'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFarmer?.(farmer.id)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-emerald-700 shadow-sm transition-colors hover:bg-rose-50 hover:text-rose-600"
                aria-label={`Remove ${farmer.nickname || 'farmer'}`}
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}