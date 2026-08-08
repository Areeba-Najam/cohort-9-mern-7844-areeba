const { asyncHandler } = require('../middleware/errorHandler');
const noteService = require('../services/noteService');

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await noteService.createNote(req.user._id, { title, content, tags });

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

module.exports = { createNote, getNotes, getNote, updateNote, deleteNote };