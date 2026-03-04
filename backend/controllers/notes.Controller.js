const Note = require("../models/Note");
const { validationResult } = require("express-validator");

// Route 1 - Fetch All Notes
const fetchAllNotes = async (req, res) => {
  try {
    const userId = req.user.id; // ❗ no Number() needed for MongoDB
    const notes = await Note.find({ user: userId });

    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server occurred");
  }
};

// Route 2 - Add Note
const addNotes = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const { title, description, tag } = req.body;

    const note = new Note({
      title,
      description,
      tag,
      user: userId,
    });

    const savedNotes = await note.save();
    res.json(savedNotes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server occurred");
  }
};

// Route 3 - Update Note
const updateNote = async (req, res) => {
  try {
    const noteId = req.params.id; // ❗ Mongo uses string ObjectId
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // 🔥 FIXED: compare with user id, not noteId
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      noteId,
      { $set: newNote },
      { new: true },
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server occurred");
  }
};

// Route 4 - Delete Note
const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    let note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    // 🔥 FIXED: compare correctly
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json("Not Allowed");
    }

    await Note.findByIdAndDelete(noteId);

    res.json({ success: "Note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server occurred");
  }
};

module.exports = {
  fetchAllNotes,
  addNotes,
  updateNote,
  deleteNote,
};
