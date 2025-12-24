const mongoose = require('mongoose');
const postSchema = new mongoose.schema({
    clerkUserId:{
        String,
    },
    imageUrl:{String},
    content:{String}
},{
     timestamps: true,
})
module.exports = mongoose.model("posts",postSchema);