const { Resend } = require("resend");
const bcrypt = require("bcryptjs");
const UserOTPVerification = require("../models/UserOTPVerification.js");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPVerificationEmail = async ({ _id, email }) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const saltRounds = await bcrypt.genSalt(10);
    let hashedOTP = await bcrypt.hash(otp, saltRounds);

    await UserOTPVerification.create({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await resend.emails.send({
      from: "noreply@arpitregmi.com.np",
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the NoteX application to verify your Email Address and complete the verification process.</p><p>The OTP will expire in <b>1 Hour</b>.</p>`,
    });

    console.log("OTP email sent successfully");

    return {
      status: "pending",
      message: "Verification Code Sent",
      data: { userId: _id, email },
    };
  } catch (error) {
    console.error("Email sending failed:", error.message);
    return {
      status: "failed",
      message: error.message,
    };
  }
};

module.exports = sendOTPVerificationEmail;
