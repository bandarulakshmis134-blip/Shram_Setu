const express =
 require("express");

const router =
 express.Router();

const {

 sendOTP,
 verifyOTP,
 resetPassword

} = require(

 "../controllers/forgotPasswordController"

);

/*
SEND OTP
*/
router.post(
 "/send-otp",
 sendOTP
);

/*
VERIFY OTP
*/
router.post(
 "/verify-otp",
 verifyOTP
);

/*
RESET PASSWORD
*/
router.post(
 "/reset-password",
 resetPassword
);

module.exports =
 router;