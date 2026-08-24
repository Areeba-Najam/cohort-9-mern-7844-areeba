import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RichTextEditor from './RichTextEditor';
import ColorPicker, { NOTE_COLORS } from './ColorPicker';
import { useTheme } from '../context/ThemeContext';

function NoteEditor({ note, onSave, onCancel }) {
  const { theme } = useTheme();

  const defaultColorName = NOTE_COLORS?.[0]?.name || 'default';

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tagsInput, setTagsInput] = useState(note?.tags?.join(', ') || '');
  const [color, setColor] = useState(note?.color || defaultColorName);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTagsInput(note?.tags?.join(', ') || '');
    setColor(note?.color || defaultColorName);
    setError('');
  }, [note, defaultColorName]);

  const isDirty =
    title !== (note?.title || '') ||
    content !== (note?.content || '') ||
    tagsInput !== (note?.tags?.join(', ') || '') ||
    color !== (note?.color || defaultColorName);

  const handleCancel = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmDiscard) return;
    }
    onCancel();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty]);
  
  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setSaving(true);
    setError('');
    try {
      await onSave({ title: title.trim(), content, tags, color });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const safeColors = NOTE_COLORS?.length > 0 
    ? NOTE_COLORS 
    : [{ name: 'default', light: '#ffffff', dark: '#1f2937' }];
    
  const ColorObj = safeColors.find((c) => c.name === color) || safeColors[0];
  const bgLight = ColorObj.light || '#ffffff';
  const bgDark = ColorObj.dark || '#1f2937';
  
  const modalGradient = theme === 'dark' 
    ? `linear-gradient(160deg, ${bgDark}, ${bgDark})` 
    : `linear-gradient(160deg, ${bgLight}, ${bgLight}e6)`;

  return (
    <div
      role="presentation"
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === 'Enter') handleCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Note Editor Modal"
        className="rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 w-full max-w-lg p-6 cursor-default"
        style={{ background: modalGradient }}
      >
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {note ? 'Edit note' : 'New note'}
        </h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <input
          aria-label="Note title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-lg font-medium border-b border-gray-300 dark:border-gray-700 pb-2 mb-3 focus:outline-none focus:border-brand bg-transparent text-gray-900 dark:text-white dark:placeholder-gray-400"
        />

        <div className="mb-3">
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        <input
          aria-label="Note tags"
          placeholder="Tags (comma separated)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full text-xs border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 mb-5 focus:outline-none focus:border-brand bg-white/60 dark:bg-black/40 text-gray-900 dark:text-white dark:placeholder-gray-400"
        />

        <div className="mb-5">
          <ColorPicker selected={color} onSelect={setColor} />
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-brand text-white rounded-lg disabled:opacity-60 transition-opacity shadow-sm"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

NoteEditor.propTypes = {
  note: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    color: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

NoteEditor.defaultProps = {
  note: null,
};

export default NoteEditor;