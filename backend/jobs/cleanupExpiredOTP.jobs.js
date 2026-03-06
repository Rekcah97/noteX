const UserOTPVerification = require("../models/UserOTPVerification.js");

const cleanupExpiredOTP = async () => {
  try {
    const result = await UserOTPVerification.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    console.log(`Deleted ${result.deletedCount} expired OTPs`);
  } catch (err) {
    console.log("Error in cleaningup expired OTP");
  }
};

module.exports = cleanupExpiredOTP;
