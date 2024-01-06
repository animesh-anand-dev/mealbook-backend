const express = require("express");
const app = express();

const database = require("./config/database");
const {sendSignUpOTP} = require("./controllers/Auth");

const dotenv = require("dotenv");
// Loading environment variables from .env file
dotenv.config();
app.use(express.json());

// PORT NUMBER
const PORT = process.env.PORT || 4000;

// database connect
database.connect();

// define route
// get function is used to routes the HTTP GET Requests to the path which is being specified with the specified callback functions.
app.get("/",(req,res)=>{
    console.log(req.ip)
    return res.json({
        success:true,
        message:"Your server is up and running...Animesh"
    });
});

app.post("/sendotp", sendSignUpOTP);

// app.get('/api/whoami', (req,res) => {
//     let myIP = req.header("X-Forwarded-For").split(',')[0]; 
    
//     const clientLang = req.header('Accept-Language');
//     const clientSystem = req.header('User-Agent');
  
//     res.json({ipaddress: myIP, language: clientLang, software: clientSystem});
//   });


// listen method is used to tell app to start on specific address/port
app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})

