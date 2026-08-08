const Note = require('../models/Note');
const { AppError } = require('../middleware/errorHandler');

const createNote = async (userId, { title, content, tags }) => {
  const note = await Note.create({ user: userId, title, content, tags });
  return note;
};

const getNotesForUser = async (userId) => {
  return Note.find({ user: userId }).sort({ isPinned: -1, createdAt: -1 });
};

const getNoteById = async (userId, noteId) => {
  const note = await Note.findOne({ _id: noteId, user: userId });
  if (!note) {
    throw new AppError('Notes not found', 404);
  }
  return note;
};

const updateNote = async (userId, noteId, updates) => {
  const allowedFields = ['title', 'content', 'isPinned', 'tags'];
  const sanitizedUpdates = {};

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      sanitizedUpdates[field] = updates[field];
    }
  }

  const note = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    sanitizedUpdates,
    { new: true, runValidators: true }
  );

  if (!note) {
    throw new AppError('Note not found', 404);
  }

  return note;
};

const deleteNote = async (userId, noteId) => {
  const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
  if (!note) {
    throw new AppError('Note not found', 404);
  }
  return note;
};

module.exports = { createNote, getNotesForUser, getNoteById, updateNote, deleteNote };