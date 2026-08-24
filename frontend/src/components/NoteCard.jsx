import PropTypes from 'prop-types';
import { NOTE_COLORS } from './ColorPicker';
import { useTheme } from '../context/ThemeContext';

function colorFor(name) {
  return NOTE_COLORS.find((c) => c.name === name) || NOTE_COLORS[0];
}

function NoteCard({ note, onOpen, onTogglePin, onDelete, isSelected, onToggleSelect }) {
  const color = colorFor(note.color);
  const { theme } = useTheme();

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative break-inside-avoid mb-4 rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 ${
        isSelected ? 'border-brand ring-2 ring-brand' : 'border-black/5 dark:border-white/10'
      }`}
      style={{
        background: `linear-gradient(160deg, ${theme === 'dark' ? color.dark : color.light}, ${theme === 'dark' ? color.dark : color.light}cc)`,
      }}
      onClick={() => onOpen(note)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(note);
        }
      }}
    >
      <button
        type="button"
        aria-label={isSelected ? 'Deselect note' : 'Select note'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(note._id);
        }}
        className={`absolute top-4 left-4 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
          isSelected ? 'bg-brand border-brand' : 'bg-white/80 border-gray-300 dark:bg-black/20 dark:border-white/30'
        }`}
      >
        {isSelected && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="p-5 pl-12">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg tracking-tight leading-snug break-words">
            {note.title}
          </h3>
          <button
             type="button"
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
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
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 font-medium break-words line-clamp-6 leading-relaxed">
            {new DOMParser().parseFromString(note.content, 'text/html').body.textContent || ''}
          </p>
        )}
        
        {note.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-black/10 text-gray-800 dark:bg-white/10 dark:text-slate-100">
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
              type="button"
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
              type="button"
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

NoteCard.propTypes = {
  note: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    color: PropTypes.string,
    isPinned: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    updatedAt: PropTypes.string,
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
  onTogglePin: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  onToggleSelect: PropTypes.func.isRequired,
};

NoteCard.defaultProps = {
  isSelected: false,
};

export default NoteCard;