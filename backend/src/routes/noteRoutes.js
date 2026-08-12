const express = require('express');
const {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNote);
router.patch('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;