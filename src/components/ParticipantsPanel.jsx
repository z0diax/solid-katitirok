export default function ParticipantsPanel({ farmers }) {
  const sortedFarmers = [...farmers].slice().reverse();

  return (
    <aside className="w-full xl:w-80 shrink-0 rounded-[2rem] border-4 border-amber-900 bg-white/90 shadow-2xl backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-950">Participants</h2>
          <p className="text-sm font-semibold text-emerald-700">{farmers.length} farmers on the field</p>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-900">
          Live
        </div>
      </div>

      <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
        {sortedFarmers.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50 px-4 py-6 text-center text-sm font-semibold text-emerald-700">
            No farmers yet. Add one with the camera.
          </div>
        ) : (
          sortedFarmers.map(farmer => (
            <div
              key={farmer.id}
              className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-3 shadow-sm"
            >
              <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md bg-white flex-shrink-0">
                <img
                  src={farmer.imgUrl}
                  alt={farmer.nickname ? `${farmer.nickname} avatar` : 'Farmer avatar'}
                  className="h-full w-full object-cover scale-[1.1]"
                  draggable="false"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-black text-emerald-950">
                  {farmer.nickname || 'Unnamed Farmer'}
                </div>
                <div className="truncate text-xs font-semibold text-emerald-700">
                  {farmer.state === 'walking' ? 'Walking the field' : 'Taking a break'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}