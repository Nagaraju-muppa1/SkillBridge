require('dotenv').config();
const express = require('express');
const coursedb = require('./database/coursedb.js')
const route = require('./routes/route.js');
const cors = require('cors');
const port =5003;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/',route);
app.listen(port,(req,res)=>{
    console.log(`server is running at port:5003`);
})
