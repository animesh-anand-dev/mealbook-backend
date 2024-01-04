const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.model({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    rating:{
        type:Number,
        required:true
    },
    review:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    dishes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dishes",
        index:true
        // why is need of index
    }
})

module.exports = mongoose.model("RatingAndReview",ratingAndReviewSchema);




