const mongoose = require("mongoose");
// creating an instance of mongoose class

const dishesSchema = new mongoose.Schema({
    dishName:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        
    },
    foodType:{
        type:String,
        required:true,
        enum:["Veg","Non-Veg"]
    },
    // veg non veg
    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview"
    }],
    category:{
        type:mongoose.mongo.Schema.Types.ObjectId,
        ref:"Category"
    }
    
})

module.exports = mongoose.model("Dishes",dishesSchema);