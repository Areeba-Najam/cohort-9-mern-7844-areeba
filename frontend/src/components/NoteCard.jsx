const ACCENTS = ['#ffe8d6', '#e0f2f1', '#fde2e4', '#e7e6ff', '#fff3b0', '#d8f3dc'];

function accentFor(id) {
  let sum = 0;
  for (const ch of id) sum += ch.charCodeAt(0);
  return ACCENTS[sum % ACCENTS.length];
}

function NoteCard({ note, onOpen, onTogglePin, onDelete }) {
  return (
    <div
      className="break-inside-avoid mb-4 rounded-2xl border border-black/5 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
      style={{ backgroundColor: accentFor(note._id) }}
      onClick={() => onOpen(note)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 text-base leading-snug break-words">
            {note.title}
          </h3>
          <button
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note);
            }}
            className={`text-lg leading-none shrink-0 ${note.isPinned ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
          >
            
          </button>
        </div>

        {note.content && (
          <p className="mt-2 text-sm text-gray-700 break-words line-clamp-6">
            {note.content.replace(/<[^>]*>/g, ' ').trim()}
          </p>
        )}

        {note.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full bg-black/10 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          
          <div className="flex gap-4">
            <button
              aria-label="Edit note"
              onClick={(e) => {
                e.stopPropagation(); // Stops the click from bubbling up to the whole card
                onOpen(note);
              }}
              className="text-xs text-gray-600 hover:text-brand font-medium transition-colors"
            >
              Edit
            </button>
            <button
              aria-label="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note);
              }}
              className="text-xs text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;