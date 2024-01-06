const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const OTPSchema = new mongoose.Schema({

    mobile: {
        type: Number,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5*60
    } 
});

async function sendMobileOTP(number, otp) {
    const otpApi = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMS_API_KEY}&route=otp&variables_values=${otp}&flash=0&numbers=${number}`;
    const response = await fetch(otpApi);
    const data = await response.json();
    console.log("Response from Fast2SMS : ", data);
}

OTPSchema.pre("save", async function(next) {
    console.log("New OTP saved to database");
    if(this.isNew){
        await sendMobileOTP(this.mobile, this.otp);
    }
    next();
})

const OTP = mongoose.model("OTP", OTPSchema);
module.exports = OTP;
