import { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';

function NoteEditor({ note, onSave, onCancel }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tagsInput, setTagsInput] = useState(note?.tags?.join(', ') || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setTagsInput(note?.tags?.join(', ') || '');
    setError('');
  }, [note]);

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
      await onSave({ title: title.trim(), content, tags });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
          className="w-full text-lg font-medium border-b border-gray-200 pb-2 mb-3 focus:outline-none focus:border-brand"
        />

        <div className="mb-3">
            <RichTextEditor content={content} onChange={setContent} />
        </div>

        <input
          aria-label="Note tags"
          placeholder="Tags, comma separated"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 mb-5 focus:outline-none focus:border-brand"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium bg-brand text-white rounded-lg disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;