import { useRef } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';

function ExportImport({ notes, selectedIds, onImported }) {
  const fileInputRef = useRef(null);

  const notesToExport =
    selectedIds.length > 0 ? notes.filter((n) => selectedIds.includes(n._id)) : notes;

  const handleExport = () => {
    if (notesToExport.length === 0) {
      window.alert('No notes to export.');
      return;
    }

    const exportData = {
      version: "1.0",
      exportedBy: notesToExport[0]?.user || "unknown", 
      notes: notesToExport
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const suffix = selectedIds.length > 0 ? `${selectedIds.length}-selected` : 'all';
    link.download = `notes-export-${suffix}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);

    const isPlainArray = Array.isArray(parsed);
    const isWrappedFormat = parsed && typeof parsed === 'object' && Array.isArray(parsed.notes);

    if (!isPlainArray && !isWrappedFormat) {
      throw new Error('File must be a notes export — either an array of notes or an object with a "notes" array.');
    }

    const res = await api.post('/notes/import', parsed);
    const importedNotes = res.data.data?.notes || res.data.notes || [];

    onImported(importedNotes);
    window.alert(`Successfully imported ${importedNotes.length} note(s)!`);
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || 'Could not import file. Please check it is a valid notes export.';
    window.alert(errorMessage);
  } finally {
    e.target.value = '';
  }
};

  return (
    <div className="flex items-center gap-2">
      {selectedIds.length > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {selectedIds.length} selected
        </span>
      )}
      <button
        type="button"
        onClick={handleExport}
        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {selectedIds.length > 0 ? `Export (${selectedIds.length})` : 'Export all'}
      </button>
      <button
        type="button"
        onClick={handleImportClick}
        className="text-xs text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Import
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

ExportImport.propTypes = {
  notes: PropTypes.array.isRequired,
  selectedIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onImported: PropTypes.func.isRequired,
};

export default ExportImport;