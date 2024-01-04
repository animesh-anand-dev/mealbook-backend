const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dishes",
        required:true
    }],
    quantity:{
        type:Number
    },
    totalPrice:{
        type:Number
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    table:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Table"
    }

});

module.exports = mongoose.model("OrderItem", orderItemSchema);

