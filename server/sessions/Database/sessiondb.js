const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URL )
.then(()=>{console.log("DB successfully connected")})
.catch((e)=>{console.log(e)});
const dbc = mongoose.connection
module.exports = dbc;