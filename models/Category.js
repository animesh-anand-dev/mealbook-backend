const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true
    },
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Dishes"
    }]
})
// dish should be plural or singular
module.exports = mongoose.model("Category",categorySchema);