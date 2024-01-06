const User = require("../models/User");
const OTP = require("../models/OTP");

// exports.signUp = async (req, res) => {

//     try {

//     } catch {

//     }
// }

exports.sendSignUpOTP = async (req, res) => {

    try {
        // Fetch Mobile Number from Request Body
        const {mobile} = req.body;

        // Function to Validate Indian Numbers 
        function validateNumber(input) {
            let re = /^[6-9]\d{9}$/;
            return re.test(input);
        }
        
        if(!validateNumber(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Mobile Number is Invalid"
            })
        }

        // Checking if Mobile Number Already Exists
        const checkUserPresent = await User.findOne({mobile});

        if(checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User Already Registered"
            })
        }

        // Function to generate OTP
        function generateOTP() {
            let digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            return OTP;
        }

        var otp = generateOTP();
        console.log("Generated OTP : ", otp);

        const result = OTP.findOne({otp: otp});
        //console.log("OTP from DB : ", result);

        while(result==otp) {
            otp = generateOTP();
        }

        const otpPayload = {mobile, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP DATA after SAVE : ", otpBody);

        return res.status(201).json({
            success: true,
            message: "OTP Sent Successfully"
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}