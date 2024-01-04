const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // define field name with type String,required, trimmed-removes the white space
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    mobile:{
        type:Number,
        trim:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin","Manager","Waiter","Chef","Customer"]
    },
    password:{
        type:String,
        required:true,
    },
    resetPasswordExpires:{
        type:Date
    },
    token:{
        type:String
    },
    profileImage:{
        type:String,
        required:true
    },
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }],
    // why is the need of active and approved field
    active:{
        type:Boolean,
        default:true
    },
    approved:{
        type:Boolean,
        default:true
    }

},
{timestamps:true});
// adding timestamp in mongoose will add two properties of type Date to our schema that is createdAt-a date representing when this document was created and updatedAt- a date representing when this document was last updated.

module.exports = mongoose.model("User", userSchema);