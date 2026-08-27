import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchNotes, createNote, updateNote, deleteNote } from '../services/noteApi';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import ThemeToggle from '../components/ThemeToggle';
import { Link } from 'react-router-dom';
import ExportImport from '../components/ExportImport';

function renderNotesContent({ loading, filteredNotes, search, onOpen, onTogglePin, onDelete, selectedIds, onToggleSelect }) {
  if (loading) {
    return <p className="text-sm text-gray-500">Loading notes...</p>;
  }
  
  if (filteredNotes.length === 0) {

    if (search) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-20 px-4">
          <div className="text-5xl mb-4 animate-bounce">🕵️‍♂️</div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">
            No matches found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            We looked everywhere. Try searching for a different keyword!
          </p>
        </div>
      );
    }

    return (
      <div className="relative flex flex-col items-center justify-center text-center py-16 px-4 w-full max-w-2xl mx-auto overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-pink-50 dark:from-gray-800/50 dark:via-transparent dark:to-purple-900/30 rounded-3xl -z-10"></div>
        <div className="relative w-80 h-64 mb-8">
          <div className="absolute top-2 left-16 w-32 h-32 bg-pink-400/30 dark:bg-pink-500/20 rounded-full blur-xl -z-5"></div>
          <div className="absolute top-10 right-12 w-28 h-28 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-xl -z-5"></div>

          <div className="absolute top-2 left-6 bg-[#fef08a] text-yellow-900 font-bold p-4 shadow-md transform -rotate-6 w-28 h-28 flex items-center justify-center text-center transition-transform hover:scale-110 hover:rotate-0 hover:z-20 cursor-default">
            Online<br/>sticky<br/>notes
          </div>
          <div className="absolute top-12 right-2 bg-[#86efac] text-green-900 font-bold p-3 shadow-md transform rotate-6 w-32 h-16 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-0 hover:z-20 cursor-default">
            Brainstorm
          </div>
          <div className="absolute bottom-6 right-8 bg-[#7dd3fc] text-blue-900 font-bold p-3 shadow-md transform -rotate-3 w-32 h-16 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-0 hover:z-20 cursor-default">
            Organize
          </div>
          <div className="absolute bottom-4 left-8 bg-[#d9f99d] text-lime-900 font-bold p-3 shadow-md transform -rotate-12 w-24 h-20 flex items-center justify-center transition-transform hover:scale-110 hover:rotate-0 hover:z-20 cursor-default">
            Plan
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 z-10">
          It's awfully quiet in here...
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-sm z-10 mx-auto">
          Your brain is full, but your dashboard is empty! Hit that giant <span className="font-bold text-brand">+</span> button to offload your million-dollar idea before you forget it.
        </p>
      </div>
    );
  }
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {filteredNotes.map((note) => (
        <NoteCard 
          key={note._id} 
          note={note} 
          onOpen={onOpen} 
          onTogglePin={onTogglePin} 
          onDelete={onDelete} 
          isSelected={selectedIds.includes(note._id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const loadNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setError('Could not load your notes. Please refresh and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleSave = async (payload) => {
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote._id, payload);
        setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
      } else {
        const created = await createNote(payload);
        setNotes((prev) => [created, ...prev]);
      }
      setEditorOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Failed to save note:', err);
      throw err;
    }
  };
 
  const handleTogglePin = async (note) => {
    setError('');
    try {
      const updated = await updateNote(note._id, { isPinned: !note.isPinned });
      setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)));
    } catch (err) {
       console.error('Failed to toggle pin:', err);
      setError('Could not update pin status. Please try again.');
    }
  };

  const handleDelete = async (note) => {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    setError('');
    try {
      await deleteNote(note._id);
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
      setSelectedIds((prev) => prev.filter((id) => id !== note._id));
    } catch (err) {
      console.error('Failed to delete note:', err);
      setError('Could not delete the note. Please try again.');
    }
  };

  const handleToggleSelect = (noteId) => {
    setSelectedIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  const handleImported = (importedNotes) => {
    setNotes((prev) => [...importedNotes, ...prev]);
    setSelectedIds([]); 
  };

  const filteredNotes = notes.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content?.toLowerCase().includes(q) ||
      n.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-indigo-50/30 to-pink-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-200">
      <header className="sticky top-0 z-10 bg-[#faf8f5]/90 dark:bg-gray-950/90 backdrop-blur border-b border-black/5 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5b3df5] to-[#8b5cf6] flex items-center justify-center text-white shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">MindVault</h1>
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-brand transition-colors duration-200"
          />
          <div className="flex items-center gap-3">
            <ExportImport notes={notes} selectedIds={selectedIds} onImported={handleImported} />
            <ThemeToggle />
            <Link to="/profile" className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              {user?.name}
            </Link>
            <button 
              type="button"
              onClick={logout} 
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {renderNotesContent({
          loading,
          filteredNotes,
          search,
          onOpen: (n) => { setEditingNote(n); setEditorOpen(true); },
          onTogglePin: handleTogglePin,
          onDelete: handleDelete,
          selectedIds,
          onToggleSelect: handleToggleSelect,
        })}
        
      </main>

      <button
        type="button"
        aria-label="New note"
        onClick={() => {
          setEditingNote(null);
          setEditorOpen(true);
        }}
        className="group fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-tr from-brand to-blue-400 text-white text-3xl shadow-lg shadow-brand/40 hover:shadow-2xl hover:shadow-brand/60 hover:-translate-y-1 hover:scale-110 active:scale-90 transition-all duration-300 ease-out flex items-center justify-center z-40"
      >
        <span className="transition-transform duration-300 group-hover:rotate-90">+</span>
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