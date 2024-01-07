const express = require("express");
// application create
const app = express();

const database = require("./config/database");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUplaod = require("express-fileupload");
const {cloudinaryConnect} = require("./config/cloudinary");
const userRoutes = require("./routes/User");
const categoryRoutes = require("./routes/Category");


// Loading environment variables from .env file
dotenv.config();

// middlewares
app.use(cookieParser());
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

app.use(
    fileUplaod({
        useTempFiles: true,
        tempFileDir:"/tmp"
    })
);

cloudinaryConnect();

// routes
// please write routes at the end so that all the above required configuration will run.
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/category", categoryRoutes);

// listen method is used to tell app to start on specific address/port
app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})

