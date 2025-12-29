const mongoose = require('mongoose');
const postSchema =  mongoose.Schema({
    clerkUserId:{
       type:String
    },
    imageUrl:{type:String},
    content:{type:String}
},{
     timestamps: true,
})
module.exports = mongoose.model("posts",postSchema);