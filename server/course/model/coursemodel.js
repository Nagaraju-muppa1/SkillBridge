const mongoose = require('mongoose');
const courseSchema = mongoose.Schema({
    clerkUserId:{
        type:String
    },
    videoUrl:{
        type:String,
    },
    description:{
        type:String
    }
},{timestamps :true});

module.exports = mongoose.model("courses",courseSchema);