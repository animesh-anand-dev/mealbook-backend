const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
      tableName:{
            type:String,
            required:true
      },
      isOccupied:{
            type:Boolean,
            default:false
      },
      uniqueQR:{
            // string or something else
      },
      paymentStatus:{
            type:Boolean,
            default:false
      }
}) 

module.exports = mongoose.model("Table", tableSchema);
