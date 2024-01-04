const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    order:{},
    user:{},
    paymentStatus:{},
    dynamicOR:{}

});

module.exports = mongoose.model("Payment",paymentSchema);

// I think we dont need this schema