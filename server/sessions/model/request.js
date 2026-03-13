const mongoose = require('mongoose');
const requests = mongoose.Schema({
    learnerId:{
        type:String,
        required:true
    },
    
},{timestamps:true})

module.exports = mongoose.model('requests',requests)