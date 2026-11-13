const Note = require('../models/Note');

// Helper to format seconds into MM:SS
const formatSeconds = (sec) => {
  const mins = Math.floor(sec / 60);
  const remainingSecs = Math.floor(sec % 60);
  return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
};

// @desc    Get notes for a lesson or course
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.query;
    const userId = req.user._id;

    const query = { user: userId };
    if (courseId) query.course = courseId;
    if (lessonId) query.lessonId = lessonId;

    const notes = await Note.find(query).sort({ timestamp: 1 });

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a timestamped note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { courseId, lessonId, timestamp, content } = req.body;
    const userId = req.user._id;

    if (!courseId || !lessonId || timestamp === undefined || !content) {
      return res.status(400).json({
        success: false,
        message: 'courseId, lessonId, timestamp, and content are required',
      });
    }

    const formattedTimestamp = formatSeconds(Number(timestamp));

    const note = await Note.create({
      user: userId,
      course: courseId,
      lessonId,
      timestamp: Math.round(Number(timestamp)),
      formattedTimestamp,
      content: content.trim(),
    });

    res.status(201).json({
      success: true,
      note,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Note content cannot be empty' });
    }

    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Ensure note belongs to user
    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to edit this note' });
    }

    note.content = content.trim();
    await note.save();

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this note' });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: 'Note deleted successfully',
      id: req.params.id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
