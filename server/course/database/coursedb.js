const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("Database Successfully Connected.")})
.catch((e)=>{console.log(e)})
const coursedb=mongoose.connection;
module.exports = coursedb;
