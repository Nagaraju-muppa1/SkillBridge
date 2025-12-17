const mongoose = require('mongoose');
const profileSchema=mongoose.Schema({
    clerkId:{
        type:String,
    },
    city:{
        type:String,
    },
    district:{
        type:String,
    },
    state:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    country:{
        type:String,
    },
    address:{
        type:String,
    },
    skill:{
        type:String
    },
    experience:{
        type:Number
    },
    skilllevel:{
        type:String,
        enum:["Basic","Medium","Advanced"],
    },
    mode:{
        type:[String],
    },
    availabledays:{
        type:[String],
    },
    timeslots:{
        type:[String],
    },
    languages:{
        type:[String],
    },
    bio:{
        type:String,
    }

},{timestamps:true});

module.exports = mongoose.model("profiles", profileSchema);