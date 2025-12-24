require('dotenv').config();
const express = require('express');
const postdb = require('./database/postdb')
const cors = require('cors');
const app = express();
const route = require('./routes/postroutes')
const port = 5002;
app.use(cors());
app.use(express.json());
app.use('/',route);

app.listen(port,(req,res)=>{
    console.log(`Server is running at port:${port}`);
})