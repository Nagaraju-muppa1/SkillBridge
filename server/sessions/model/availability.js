const mongoose = require('mongoose');
const availability = mongoose.Schema({
    UserId:{
        type:String,
        required:true
    },
    day:{
        type:Number,
        required: true,
        min: 0,
        max: 6 
    },
    startTime:{
        type:String,
        required: true
    },
    endTime:{
        type:String,
        required: true
    }
},{timestamps:true});

module.exports = mongoose.model("available",availability)