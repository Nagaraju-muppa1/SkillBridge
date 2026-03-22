require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dbc = require('./Database/sessiondb.js');
const port = 5004;
const router = require("./routes/availableRoute.js")
app.use(cors());
app.use(express.json());
app.use('/',router);
app.get('/',(req,res)=>{
    res.send("hello world");
})

app.listen(port,(req,res)=>{
    console.log(`Server is running at port:${port}`);
})