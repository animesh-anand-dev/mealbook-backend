const express = require("express");
const router = express.Router();


// import the handler function
const {
    signUp, 
    sendSignUpOTP, 
    login,
    sendLoginOTP,
    loginOTP,
    changePassword
} = require("../controllers/Auth");

const {auth} = require("../middleware/auth");

router.post("/signUp",signUp)
router.post("/sendotp", sendSignUpOTP);
router.post("/login",login);
router.post("/sendLoginOtp",sendLoginOTP);
router.post("/loginOtp",loginOTP);
router.post("/changePassword",auth,changePassword);

// Export the router for use in the main application
module.exports = router