const  express = require("express");
const router = express.Router();

// import the handler function
const {signUp,sendSignUpOTP,login} = require("../controllers/Auth");

router.post("/signUp",signUp)
router.post("/sendotp", sendSignUpOTP);
router.post("/login",login);



// Export the router for use in the main application
module.exports = router