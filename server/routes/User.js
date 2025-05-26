// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
  login,
  signUp,
  sendOTP,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword")

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication
//Authentication routes

// Route for user login
router.post("/login",login)

// Route for user signup
router.post("/signUp",signUp)

// Route for sending OTP to the user's email
router.post("/sendOTP",sendOTP)

// Route for Changing the password
router.post("/changepassword", auth,changePassword)
//Reset password
// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

//Route for resetting user password after verification
router.post("/reset-password",resetPassword)

module.exports = router
//d6dbaab7-2ed5-4a16-ac2e-9e54049d57bf