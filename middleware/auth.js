const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// authentication-- verify the identity
exports.auth = async(req,res,next)=>{
    try {
        // extract the jwt token from either body,cookie or header
        console.log("Cookie---",req.cookies.token);
        console.log("Body---",req.body.token);
        console.log("Header---",req.header("Authorization"));

        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");

        // if token is not available
        console.log("Token ", token);
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }

        // verify the token
        try {
            // console.log("Verifying the token");
            // decode the payload and fetch the email, mobile, password, accountType
            const decode = jwt.verify(token,process.env.JWT_SECRET);

            //jo bhi request mai user hai us k body m ye decode dal de
            req.userExist = decode;
            // decode will return object with the email, mobile,password, accountType 
        } catch (error) {
            console.log("Error occured while validating the token :", error);
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong, while verifying the token"
        });        
    }
}

// Authorization----give access right/ permission of some roles

// "Admin"
exports.isAdmin =(req,res,next) =>{
    try {
        if(req.userExist.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for ADMIN"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User accountType cannot be verified"
        });
    }
}
// "Manager"
exports.isManager =(req,res,next)=>{
    try {
        if(req.userExist.accountType !== "Manager"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for MANAGER"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User accountType cannot be verified"
        });
    }
}
// "Waiter"
exports.isWaiter =(req,res,next)=>{
    try {
        if(req.userExist.accountType !== "Waiter"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for WAITER"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User accountType cannot be verified"
        });
    }
}
// "Chef"
exports.isChef =(req,res,next)=>{
    try {
        if(req.userExist.accountType !== "Chef"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for CHEF"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User accountType cannot be verified"
        });
    }
}
// "Customer"
exports.isCustomer =(req,res,next)=>{
    try {
        if(req.userExist.accountType !== "Customer"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for CUSTOMER"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User accountType cannot be verified"
        });
    }
}