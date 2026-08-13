import { NOTE_COLORS } from './ColorPicker';
import { useTheme } from '../context/ThemeContext';

function colorFor(name) {
  return NOTE_COLORS.find((c) => c.name === name) || NOTE_COLORS[0];
}

function NoteCard({ note, onOpen, onTogglePin, onDelete }) {
  const color = colorFor(note.color);
  const { theme } = useTheme();

  return (
    <div
      className="break-inside-avoid mb-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
      style={{backgroundColor: theme === 'dark' ? color.dark : color.light}}
      onClick={() => onOpen(note)}
    >
       <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-700 dark:text-white text-lg tracking-tight leading-snug break-words">
            {note.title}
         </h3>
          <button
            aria-label={note.isPinned ?  'Unpin note' : 'Pin note'}
            aria-pressed={note.isPinned}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note);
            }}
            className={`text-lg leading-none shrink-0 ${note.isPinned ? 'opacity-100' : 'opacity-30 hover:opacity-70'}`}
          >
            📌
          </button>
        </div>

        {note.content && (
          <p className="mt-2 text-sm text-white-700 break-words line-clamp-6">
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
          <span className="text-xs text-slate-500 dark:text-slate-300">
            {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <div className="flex gap-4">
            <button
              aria-label="Edit note"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(note);
              }}
              className="text-xs text-slate-500 dark:text-slate-300 hover:text-brand dark:hover:text-blue-400 font-medium transition-colors"
            >
              Edit
            </button>
            <button
              aria-label="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note);
              }}
              className="text-xs text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
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

