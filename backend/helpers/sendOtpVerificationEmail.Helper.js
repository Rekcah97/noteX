const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const UserOTPVerification = require("../models/UserOTPVerification.js");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_APP_PASS,
  },
});

const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the Node-X application to verify your Email Address And complete the verification process.</p><p>The OTP will expire in <b>1 Hour</b>.</p>`,
    };
    const saltRounds = await bcrypt.genSalt(10);
    let hashedOTP = await bcrypt.hash(otp, saltRounds);

    await UserOTPVerification.create({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await transporter.sendMail(mailOptions);
    return {
      status: "pending",
      message: "Verification Code Sent",
      data: {
        userId: _id,
        email,
      },
    };
  } catch (error) {
    return {
      status: "failed",
      message: error.message,
    };
  }
};

module.exports = sendOTPVerificationEmail;
