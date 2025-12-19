require("dotenv").config();
const app = require('./app.js')
const userRoutes = require('./routes/userroutes.js');
const port = 5000; 
app.get('/',(req,res)=>{
   res.send("Api gateway is working fine!");
})
app.use('/api/v1/user', userRoutes);
app.listen(port,()=>{
   console.log(`Gateway is running on http://localhost:${port}`);
})