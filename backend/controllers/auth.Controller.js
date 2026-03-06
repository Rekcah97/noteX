const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const sendOTPVerificationEmail = require("../helpers/sendOtpVerificationEmail.Helper.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const UserOTPVerification = require("../models/UserOTPVerification.js");

// Route 1 - Create User
const createUser = async (req, res) => {
  console.log("signup route was hit");
  let success = false;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    let { email, name, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "Failed",
        message: "Empty input",
      });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const otpResult = await sendOTPVerificationEmail(savedUser);

    if (otpResult.status === "failed") {
      return res
        .status(500)
        .json({ success: false, message: otpResult.message });
    }

    const payload = {
      user: {
        id: savedUser.id,
      },
    };

    const authToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);

    success = true;
    console.log("running singup route ");
    return res.json({
      success,
      auth: authToken,
      userId: savedUser.id,
      userEmail: savedUser.email,
    });
  } catch (error) {
    console.error("Error in /createuser:", error.message);
    return res.status(500).json({
      status: "Failed",
      message: "Internal server error",
    });
  }
};

// Route 2 - Login
const userLogin = async (req, res) => {
  console.log("login route was hit");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    let success = false;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success, errors: "Please login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res
        .status(400)
        .json({ success, errors: "Please login with correct credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    success = true;
    console.log("running login in route");
    res.json({
      success,
      auth: authtoken,
      name: user.name,
      isVerified: user.verified,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server occurred");
  }
};

// Route 3 - Fetch User
const fetchUser = async (req, res) => {
  try {
    console.log(" user fetch was hit");
    const userId = req.user.id; // ❗ removed Number()
    const user = await User.findById(userId).select("-password");
    console.log(" user fetch was hit");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server occurred");
  }
};

// Route 4 - Verify Email
const verifyEmail = async (req, res) => {
  try {
    console.log(" verify email route was hit");
    const userId = req.user.id;
    const { otp } = req.body;

    if (!userId || !otp) {
      throw Error("Empty OTP details are not allowed");
    }

    const records = await UserOTPVerification.find({ userId });

    if (records.length <= 0) {
      throw new Error(
        "Account record doesn't exist or already verified. Please sign up or login",
      );
    }

    const { expiresAt, otp: hashedOTP } = records[0];

    if (expiresAt < Date.now()) {
      await UserOTPVerification.deleteMany({ userId });
      throw Error("Code has expired. Please try again");
    }

    const validOTP = await bcrypt.compare(otp, hashedOTP);
    if (!validOTP) {
      throw new Error("Invalid code. Check your inbox");
    }

    await User.updateOne({ _id: userId }, { verified: true });
    await UserOTPVerification.deleteMany({ userId });

    console.log("running verify email route");
    res.json({
      status: "verified",
      message: "User email verified successfully",
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
};

// Route 5 - Resend OTP
const resentVerificationOtp = async (req, res) => {
  try {
    console.log("resend verification route was hit");
    const userId = req.user.id;
    const { email } = req.body;

    if (!userId || !email) {
      throw Error("Empty user details are not allowed");
    }
    const user = await User.findById(userId);

    const verificationStatus = user.verified;

    if (verificationStatus) {
      res.json({
        status: "failed",
        msg: "user is already verified",
      });
    }

    await UserOTPVerification.deleteMany({ userId });

    await sendOTPVerificationEmail({ _id: userId, email });

    console.log("running resend verification route");

    res.json({
      status: "sent",
    });
  } catch (error) {
    res.json({
      status: "failed",
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  userLogin,
  fetchUser,
  verifyEmail,
  resentVerificationOtp,
};
