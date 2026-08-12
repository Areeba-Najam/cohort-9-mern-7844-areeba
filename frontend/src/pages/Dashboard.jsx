import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchNotes, createNote, updateNote, deleteNote } from '../services/noteApi';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';

function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loadNotes = async () => {
    setLoading(true);
    const data = await fetchNotes();
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async (payload) => {
    if (editingNote) {
      const updated = await updateNote(editingNote._id, payload);
      setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
    } else {
      const created = await createNote(payload);
      setNotes((prev) => [created, ...prev]);
    }
    setEditorOpen(false);
    setEditingNote(null);
  };

  const handleTogglePin = async (note) => {
    const updated = await updateNote(note._id, { isPinned: !note.isPinned });
    setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
  };
  const handleDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"?`)) return;

    try {
      await deleteNote(note._id);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.response?.data?.message || "Failed to delete the note. Is your backend server running?");
    }
  };
//   const handleDelete = async (note) => {
//     if (!window.confirm(`Delete "${note.title}"?`)) return;
//     await deleteNote(note._id);
//     setNotes((prev) => prev.filter((n) => n._id !== note._id));
//   };

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q) ||
      n.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <header className="sticky top-0 z-10 bg-[#faf8f5]/90 backdrop-blur border-b border-black/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Notes</h1>

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-brand"
          />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <p className="text-sm text-gray-500">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-500 text-sm">
              {search ? 'No notes match your search.' : 'No notes yet — create your first one.'}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onOpen={(n) => {
                  setEditingNote(n);
                  setEditorOpen(true);
                }}
                onTogglePin={handleTogglePin}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <button
        aria-label="New note"
        onClick={() => {
          setEditingNote(null);
          setEditorOpen(true);
        }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-brand text-white text-2xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        +
      </button>

      {editorOpen && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onCancel={() => {
            setEditorOpen(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;