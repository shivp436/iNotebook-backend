import { Note, INote } from '../models/Note';
import { Request, Response } from 'express';
import respond from '../helpers/response';

// Note Model
// interface INote {
//   title: string;
//   content: string;
//   tags: string[];
//   user: string;
//   isPinned: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

interface AuthenticatedRequest extends Request {
  user?: any;
  newToken?: string | undefined;
}

// @desc    Get all notes
// @route   GET /api/v1/notes/get-all-notes
// @access  Private
const getAllNotes = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      respond(res, 401, 'error', 'Unauthorized: No User found');
      return;
    }

    const notes = await Note.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (notes.length === 0) {
      respond(res, 200, 'success', 'No notes found for user', {
        _notes: [],
        _token: req.newToken,
      });
      return;
    }

    respond(res, 200, 'success', 'Notes fetched successfully', {
      _notes: notes,
      _token: req.newToken,
    });
  } catch (error) {
    respond(res, 500, 'error', 'Server error', {
      _error: error,
    });
  }
};

// @desc    Get a note
// @route   GET /api/v1/notes/get-note/:id
// @access  Private
const getNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      respond(res, 401, 'error', 'Unauthorized: No User found');
      return;
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      respond(res, 404, 'error', 'Note not found');
      return;
    }

    // check if note belongs to user
    if (note.user.toString() !== req.user._id.toString()) {
      respond(res, 401, 'error', 'Unauthorized: Note does not belong to user');
      return;
    }

    respond(res, 200, 'success', 'Note fetched successfully', {
      _note: note,
      _token: req.newToken,
    });
  } catch (error) {
    respond(res, 500, 'error', 'Server error', {
      _error: error,
    });
  }
};

// @desc    Create a note
// @route   POST /api/v1/notes/create-note
// @access  Private
const createNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      respond(res, 401, 'error', 'Unauthorized: No User found');
      return;
    }

    const { title, content, tags, isPinned } = req.body;

    // Validation (optional): Check if required fields are provided
    if (!title || !content) {
      respond(res, 400, 'error', 'Title and content are required');
      return;
    }

    const newNote: INote = {
      title,
      content,
      tags,
      user: req.user._id,
      isPinned,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const note = await Note.create(newNote);

    respond(res, 201, 'success', 'Note created successfully', {
      _note: note,
      _token: req.newToken,
    });
  } catch (error) {
    respond(res, 500, 'error', 'Server error', {
      _error: error,
    });
  }
};

// @desc    Update a note
// @route   PUT /api/v1/notes/update-note/:id
// @access  Private
const updateNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      respond(res, 401, 'error', 'Unauthorized: No User found');
      return;
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      respond(res, 404, 'error', 'Note not found');
      return;
    }

    // Check if note belongs to the user
    if (note.user.toString() !== req.user._id.toString()) {
      respond(res, 401, 'error', 'Unauthorized: Note does not belong to user');
      return;
    }

    const { title, content, tags, isPinned } = req.body;

    // Validation (optional): Check if required fields are provided
    if (!title || !content) {
      respond(res, 400, 'error', 'Title and content are required');
      return;
    }

    // Update note fields
    note.title = title || note.title;
    note.content = content || note.content;
    note.tags = tags || note.tags;
    note.isPinned = typeof isPinned !== 'undefined' ? isPinned : note.isPinned;
    note.updatedAt = new Date();

    // Save updated note to the database
    await note.save();

    respond(res, 200, 'success', 'Note updated successfully', {
      _note: note,
      _token: req.newToken,
    });
  } catch (error) {
    console.error(error);
    respond(res, 500, 'error', 'Server error', {
      _error: error,
    });
  }
};

// @desc    Delete a note
// @route   DELETE /api/v1/notes/delete-note/:id
// @access  Private
const deleteNote = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      respond(res, 401, 'error', 'Unauthorized: No User found');
      return;
    }

    const note = await Note.findById(req.params.id);

    if (!note) {
      respond(res, 404, 'error', 'Note not found');
      return;
    }

    // Check if note belongs to the user
    if (note.user.toString() !== req.user._id.toString()) {
      respond(res, 401, 'error', 'Unauthorized: Note does not belong to user');
      return;
    }

    await Note.findByIdAndDelete(req.params.id);

    respond(res, 200, 'success', 'Note deleted successfully', {
      _note: note,
      _token: req.newToken,
    });
  } catch (error) {
    respond(res, 500, 'error', 'Server error', {
      _error: error,
    });
  }
};

export {
  getAllNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  // filterNotesByTitle,
  // filterNotesByTag,
};
