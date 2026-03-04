const express = require("express");
const router = express.Router();

var fetchuser = require("../middleware/fetchuser.Middleware.js");
const { body } = require("express-validator");
const {
  fetchAllNotes,
  addNotes,
  updateNote,
  deleteNote,
} = require("../controllers/notes.Controller.js");

// ROUTE 1
router.get("/fetchallnotes", fetchuser, fetchAllNotes);

// ROUTE 2
router.post(
  "/addnotes",
  fetchuser,
  [
    //making sure title  & description is not empty
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Enter a valid email").isLength({ min: 3 }),
  ],
  addNotes,
);

// ROUTE 3
router.put("/updatenote/:id", fetchuser, updateNote);

// ROUTE 4
router.delete("/deletenote/:id", fetchuser, deleteNote);

module.exports = router;
