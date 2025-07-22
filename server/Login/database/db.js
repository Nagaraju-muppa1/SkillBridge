const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://nagarajumuppavaram2491:skillbridge123@cluster0.uhzf0p4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(()=>{console.log("DB successfully connected")})
.catch((e)=>{console.log(e)});
const dbc = mongoose.connection
module.exports = dbc;