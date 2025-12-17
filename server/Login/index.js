const express = require('express');
const cors = require('cors');
const app = express();
const route = require('./routes/userroute.js');
const dbc = require('./database/db.js');


const port = 5000; 
app.use(cors()); 
app.use(express.json()); 

app.get('/',(req,res)=>{
   res.send("It's working fine!");
})
app.use('/api', route);
app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`);
})