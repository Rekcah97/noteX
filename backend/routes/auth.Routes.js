const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
var fetchuser = require("../middleware/fetchuser.Middleware.js");
const {
  createUser,
  userLogin,
  fetchUser,
  verifyEmail,
  resentVerificationOtp,
} = require("../controllers/auth.Controller.js");

// ROUTE 1
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  createUser,
);

// ROUTE 2
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be empty").exists(),
  ],
  userLogin,
);

// ROUTE 3
router.get("/getuser", fetchuser, fetchUser);

// ROUTE 4
router.post("/verifyOTP", fetchuser, verifyEmail);

// ROUTEss 5
router.post("/resendOTP", fetchuser, resentVerificationOtp);

module.exports = router;
