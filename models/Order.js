const mongoose = require("mongoose");

const orderSchema = new mongoose.model({
    paymentStatus:{
        type:Boolean,
        default:false
    },
    totalPrice:{
        type:Number,

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
    },
    orderItem:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderItem"
    }]

})

module.exports = mongoose.model("Order", orderSchema);


