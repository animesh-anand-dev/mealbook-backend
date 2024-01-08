const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();


// signUp otp controller
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
            console.log("Otp: ",OTP);
            return OTP;
        }

        var otp = generateOTP();
        console.log("Generated OTP : ", otp);

        const result = OTP.findOne({otp: otp});
        console.log("OTP from DB : ", result);

        while(result==otp) {
            otp = generateOTP();
        }

        const otpPayload = {mobile, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP DATA after SAVE : ", otpBody);

        return res.status(201).json({
            success: true,
            message: "OTP Sent Successfully",
            
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// signUp controller to register user
exports.signUp = async (req,res)=>{
    try {
        // fetch data from request body or user input
        const {firstName, lastName, email, mobile, password, confirmPassword, accountType, otp } = req.body;

        //check if all details are filled or not
        if(!firstName || !lastName || !email || !mobile || !password || !confirmPassword || !accountType || !otp) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        // check if the password and confirmPassword is same or not
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password does not matched, Please try again later"
            });
        }

        // validate the email
        function validateEmail(email){
            let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return validRegex.test(email);
        }
        if(!validateEmail(email)){
            return res.status(400).json({
                success:false,
                message:"Email entered is incorrect"
            })
        }

        // check the mobile number is valid or not
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
        
        // check if user already registered or not
        const checkUserPresent = await User.findOne({mobile});
        if(checkUserPresent){
            return res.status(400).json({
                success:false,
                message:"User already registered"
            });
        }

        // find the recentOtp stored for the user
        const recentOtp = await OTP.findOne({mobile}).sort({createdAt: -1}).limit(1);
        console.log("recentOtp: ",recentOtp);
        // validate otp
        if(recentOtp?.length === 0){
            // OTP not found for the number
            return res.status(400).json({
                success:false,
                message:"The otp is not found"
            });
        }else if(otp !== recentOtp?.otp){
            return res.status(400).json({
                success:false,
                message:"The otp is not valid"
            });
        }
        console.log("Otp validation: ",otp === recentOtp.otp);
        // secured the password
        const hashedPassword = await bcrypt.hash(password,10);

        //create the user
        let approved ="";

        const user = await User.create({
            firstName, lastName, email, mobile, 
            password:hashedPassword,
            accountType:accountType,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        console.log("User Created Successfully : ", user);

        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user
        });

    } catch (error) {
        console.log("Error in creating user", error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again later"
        });
    }
}

// sendOtp for login
exports.sendLoginOTP = async(req,res) =>{
    try {
        // fetch mobile from req body
        const {mobile} = req.body;
        // validate the number
        function validateNumber(mobile){
            let re = /^[6-9]\d{9}$/;
            return re.test(mobile);
        }
        if(!validateNumber(mobile)){
            return res.status(400).json({
                succcess:false,
                message:"Mobile number is invalid"
            })
        }

        // check if the user exist or not
        const userExist = await User.findOne({mobile});
        
        if(!userExist){
            return res.status(400).json({
                succcess:false,
                message:"User is not registered, Please signUp to continue"
            })
        }
         // Function to generate OTP
         function generateOTP() {
            let digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            console.log("Otp for login: ",OTP);
            return OTP;
        }

        var otp = generateOTP();
        console.log("Generated OTP for login : ", otp);

        const result = OTP.findOne({otp: otp});
        console.log("OTP from DB for login : ", result);

        while(result==otp) {
            otp = generateOTP();
        }

        const otpPayload = {mobile, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP DATA after SAVE : ", otpBody);

        return res.status(201).json({
            success: true,
            message: "OTP Sent Successfully",
            
        })

    } catch (error) {
        console.log("Error occured while generating otp for login",error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// login controller for authenticating user
exports.login = async(req,res)=>{
    try {
        // fetch email, mobile, password from req body
        const {mobile, password} = req.body;

        // all fields should be filed
        if(!mobile || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        } 

        // validate the number is indian
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

        // check if user is registered and find user with provided mobile
        let userExist = await User.findOne({mobile});

        // if user is not present
        if(!userExist){
            return res.status(400).json({
                success:false,
                message:"User is not registered, Please SignUp to continue"
            })
        }

        // verify the password and generate the token
        if(await bcrypt.compare(password,userExist.password)){
            // create JWT with sign method
            const token = jwt.sign({
                email:userExist.email,
                id: userExist._id,
                mobile:userExist.mobile,
                accountType:userExist.accountType
            },
            process.env.JWT_SECRET,{
                expiresIn:"24h"
            });

            // Save token to user document in database
            userExist.token = token;
            userExist.password = undefined;

            // set cookie for token and return success response
            const options ={
                expires: new Date(Date.now() + 3 * 24 * 60 *60 * 1000),
                httpOnly:true
            }
            // cookie in response
            res.cookie("token", token, options).status(200).json({
                success:true,
                message:"User logged in successfully",
                data:userExist
            });
        }else{
            // password does not matched
            return res.status(401).json({
                success:false,
                message:"Bad Credentials"
            });
        }
        return res.status(200).json({
            succcess:true,
            message:"User Logged in successfully"
        })

    } catch (error) {
        console.log("Error occured during login the user: ", error);
        return res.status(500).json({
            success: false,
            message:"Login failed, Please try again"
        });      
    }    
}

// login controller using OTP
exports.loginOTP = async(req,res)=>{
    try {
        // fetch mobile from request body
        const {mobile, otp} = req.body;
        // check if field is filled or not
        if(!mobile){
            return res.status(400).json({
                success:false,
                message:"Please filled the required details"
            })
        }
        // validate the number is indian
        function validateNumber(phone) {
            let re = /^[6-9]\d{9}$/;
            return re.test(phone);
        }
        
        if(!validateNumber(mobile)) {
            return res.status(400).json({
                success: false,
                message: "Mobile Number is Invalid"
            })
        }
        // check number is regiested user or not
        const userExist = await User.findOne({mobile});

        if(!userExist){
            return res.status(400).json({
                success:false,
                message:"User is not registered, Please signUp to continue"
            })
        }

        // find the recent otp from the db for login
        const recentOTP = await OTP.findOne({mobile}).sort({createdAt:-1}).limit(1);
        console.log("Recent otp for login: ",recentOTP);
        // validate the recent otp
        if(recentOTP.length === 0){
            // otp not found for the number
            return res.status(400).json({
                success:false,
                message:"The otp is not found for the number"
            })
        }else if( otp !== recentOTP.otp){
            return res.status(400).json({
                succcess:false,
                message:"The otp is not valid"
            })
        }
        console.log("Otp validation for login: ",otp === recentOTP.otp);

        return res.status(200).json({
            succcess:true,
            message:"User logged in successfully"
        })



    } catch (error) {
        console.log("Error occured while login the user",error);
        return res.status(500).json({
            succcess:false,
            message:"User not able to login"
        })
        
    }
}

// change password
exports.changePassword = async(req,res)=>{
    try {
        // get user data from req.userExist
        const userDetails = await User.findById(req.userExist.id);

        // fetch the data from req body
        const {currentPassword, newPassword, confirmNewPassword} = req.body;

        // validate the current password
        const isPasswordMatch = await bcrypt.compare(currentPassword,
            userDetails.password);
        
            if(!isPasswordMatch){
                return res.status(401).json({
                    succcess:false,
                    message:"The password is incorrect"
                })
            }
            // console.log("Password matched or not: ",isPasswordMatch);
            // console.log("new password: ",newPassword);
            // console.log("confirm new password: ",confirmNewPassword);

            // Match new and confirm password
            if(newPassword !== confirmNewPassword){
                return res.status(400).json({
				success: false,
				message: "The new password and confirm new password does not matched",
			});
            }

            // update password
            const encryptedPassword = await bcrypt.hash(newPassword,10);
            const updatedUserDetails = await User.findByIdAndUpdate(req.userExist.id,{
                password:encryptedPassword
            },{new:true});
            console.log("Updated password of user ",updatedUserDetails);

            // send toast that password is updated
            return res.status(200).json({
                success:true,
                message:"Password changed successfully",
                data:updatedUserDetails
            })

        
    } catch (error) {
        console.error("Error occurred while changing password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while changing password",
			error: error.message,
		});
    }
}
