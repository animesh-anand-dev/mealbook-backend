const express = require("express");
// application create
const app = express();

const database = require("./config/database");
const dotenv = require("dotenv");
const fileUplaod = require("express-fileupload");
const {cloudinaryConnect} = require("./config/cloudinary");

const {sendSignUpOTP} = require("./controllers/Auth");
const {createCategory, fetchAllCategories, updateCategory, deleteCategory} = require("./controllers/Category");
const {categoryRoutes} = require("./routes/Category");

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

app.use(
    fileUplaod({
        useTempFiles: true,
        tempFileDir:"/tmp"
    })
);

cloudinaryConnect();

//app.use("/api/v1/category", categoryRoutes);
app.post("/createCategory", createCategory);
app.get("/allCategory", fetchAllCategories);
app.patch("/updateCategory", updateCategory);
app.delete("/deleteCategory", deleteCategory);

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

