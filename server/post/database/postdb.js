const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("DB successfully connected")})
.catch((e)=>{console.log(e)});
const postdb = mongoose.connection
module.exports = postdb;