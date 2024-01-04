const express = require("express");
const app = express();

const database = require("./config/database");
const {test} = require("./controllers/Auth");

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
    return res.json({
        success:true,
        message:"Your server is up and running...Animesh"
    });
});

// listen method is used to tell app to start on specific address/port
app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})

