const { asyncHandler, AppError } = require('../middleware/errorHandler');
const noteService = require('../services/noteService');

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, color } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new AppError('Title is required and must be a non-empty string', 400);
  }

  if (title.length > 150) {
    throw new AppError('Title must be 150 characters or fewer', 400);
  }

  if (content !== undefined && typeof content !== 'string') {
    throw new AppError('Content must be a string', 400);
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === 'string')) {
      throw new AppError('Tags must be an array of strings', 400);
    }
  }

  const note = await noteService.createNote(req.user._id, { title, content, tags, color });

  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: { note },
  });
});

const getNotes = asyncHandler(async (req, res) => {
  const notes = await noteService.getNotesForUser(req.user._id);

  res.status(200).json({
    success: true,
    data: { notes, count: notes.length },
  });
});

const getNote = asyncHandler(async (req, res) => {
  const note = await noteService.getNoteById(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    data: { note },
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await noteService.updateNote(req.user._id, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: { note },
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  await noteService.deleteNote(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
  });
});
const importNotes = asyncHandler(async (req, res) => {
  const fileData = req.body; 
  let rawNotes = [];
  let fileOwner = null;

  if (Array.isArray(fileData)) {
    rawNotes = fileData;
  } else if (fileData && typeof fileData === 'object' && Array.isArray(fileData.notes)) {
    rawNotes = fileData.notes;
    fileOwner = fileData.exportedBy;
  } else {
    throw new AppError('Invalid file format. Expected a valid notes export file.', 400);
  }

  if (fileOwner && fileOwner !== req.user._id.toString() && fileOwner !== req.user.id.toString()) {
    throw new AppError('Privacy Error: You cannot import a file exported from another user account!', 403);
  }

  if (rawNotes.length === 0) {
    throw new AppError('The export file contains no notes to import.', 400);
  }

  const sanitizedNotes = rawNotes.map((note) => {
    if (!note.title || typeof note.title !== 'string' || !note.title.trim()) {
      throw new AppError('One or more notes are missing a valid title.', 400);
    }

    return {
      user: req.user._id || req.user.id,
      title: note.title.trim(),
      content: typeof note.content === 'string' ? note.content : '',
      isPinned: Boolean(note.isPinned),
      tags: Array.isArray(note.tags) ? note.tags.map(t => String(t).trim()) : [],
      color: note.color || 'default',
      createdAt: note.createdAt ? new Date(note.createdAt) : new Date(),
      updatedAt: note.updatedAt ? new Date(note.updatedAt) : new Date(),
    };
  });

  const insertedNotes = await noteService.importNotesForUser(req.user._id || req.user.id, sanitizedNotes);

  res.status(201).json({
    success: true,
    message: `Successfully imported ${insertedNotes.length} note(s).`,
    data: { notes: insertedNotes },
  });
});

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote, importNotes };