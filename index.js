const express = require("express");
// application create
const app = express();

const database = require("./config/database");
const userRoutes = require("./routes/User");

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
// Loading environment variables from .env file
dotenv.config();

// middlewares
app.use(cookieParser());
app.use(express.json());

// PORT NUMBER
const PORT = process.env.PORT || 4000;

// database connect
database.connect();


// routes
app.use("/api/v1/auth",userRoutes);

// define route
// get function is used to routes the HTTP GET Requests to the path which is being specified with the specified callback functions.
app.get("/",(req,res)=>{
    console.log(req.ip)
    return res.json({
        success:true,
        message:"Your server is up and running...Animesh"
    });
});


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

