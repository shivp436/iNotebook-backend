import { Router } from 'express';
const router = Router();
import { protect } from '../middleware/authMiddleware';
import {
  createNote,
  // deleteNote,
  getNote,
  getAllNotes,
  updateNote,
  // filterNotesByTitle,
  // filterNotesByTag,
} from '../controllers/noteControllers';

// routes
router.route('/get-all-notes').get(protect, getAllNotes);
router.route('/get-note/:id').get(protect, getNote);
router.route('/create-note').post(protect, createNote);
router.route('/update-note/:id').put(protect, updateNote);
// router.route('/delete-note/:id').delete(protect, deleteNote);

// // filter routes
// router.route('/filter-notes-by-title').get(protect, filterNotesByTitle);
// router.route('/filter-notes-by-tag').get(protect, filterNotesByTag);

export default router;
