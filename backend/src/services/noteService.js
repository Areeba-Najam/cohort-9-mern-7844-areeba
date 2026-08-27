const Note = require('../models/Note');
const { AppError } = require('../middleware/errorHandler');

const createNote = async (userId, { title, content, tags, color }) => {
  try {
    const note = await Note.create({ user: userId, title, content, tags, color });
    return note;
  } catch (err) {
    if (err.name === 'ValidationError') {
      throw new AppError(err.message, 400);
    }
    throw new AppError('Failed to create note', 500);
  }
};

const getNotesForUser = async (userId) => {
  try {
    return await Note.find({ user: userId }).sort({ isPinned: -1, createdAt: -1 });
  } catch (err) {
    throw new AppError('Failed to fetch notes', 500);
  }
};

const getNoteById = async (userId, noteId) => {
  let note;
  try {
    note = await Note.findOne({ _id: noteId, user: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new AppError('Note not found', 404);
    }
    throw new AppError('Failed to fetch note', 500);
  }

  if (!note) {
    throw new AppError('Note not found', 404);
  }
  return note;
};

const updateNote = async (userId, noteId, updates) => {
  const allowedFields = ['title', 'content', 'isPinned', 'tags', 'color'];
  const sanitizedUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitizedUpdates[field] = updates[field];
    }
  }

  if (Object.keys(sanitizedUpdates).length === 0) {
    throw new AppError('Provide at least one updatable field', 400);
  }

  let note;
  try {
    note = await Note.findOneAndUpdate(
      { _id: noteId, user: userId },
      sanitizedUpdates,
      { new: true, runValidators: true }
    );
  } catch (err) {
    if (err.name === 'CastError') {
      throw new AppError('Note not found', 404);
    }
    if (err.name === 'ValidationError') {
      throw new AppError(err.message, 400);
    }
    throw new AppError('Failed to update note', 500);
  }

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  return note;
};

const deleteNote = async (userId, noteId) => {
  let note;
  try {
    note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  } catch (err) {
    if (err.name === 'CastError') {
      throw new AppError('Note not found', 404);
    }
    throw new AppError('Failed to delete note', 500);
  }

  if (!note) {
    throw new AppError('Note not found', 404);
  }
  return note;
};
async function importNotesForUser(userId, notes) {
  const notesWithUser = notes.map(note => {
    const { _id, ...rest } = note;
    return {
      ...rest,
      user: userId,
    };
  });

  try {
    return await Note.insertMany(notesWithUser, { ordered: true });
  } catch (err) {
    if (err.name === 'ValidationError' || err.name === 'CastError' || err.name === 'MongoBulkWriteError') {
      throw new AppError('One or more notes failed validation during import.', 400);
    }
    throw new AppError('Failed to import notes.', 500);
  }
}

module.exports = { createNote, getNotesForUser, getNoteById, updateNote, deleteNote, importNotesForUser };