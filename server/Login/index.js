const express = require('express');
const cors = require('cors');
const app = express();
const route = require('./routes/userroute.js');
const dbc = require('./database/db.js'); // Your database connection

// This is the port your backend server will run on
const port = 5000; 

// --- Middleware ---
// Allows your frontend (on port 5173) to talk to this server (on port 5000)
app.use(cors()); 
// Allows the server to read incoming JSON data from forms
app.use(express.json()); 

// --- Routes ---
// A simple test route to make sure the server is alive
app.get('/',(req,res)=>{
    res.send("It's working fine!");
})

// This tells Express: "Use the routes defined in userroute.js for any URL that starts with /api"
// This is how "http://localhost:5000/api/user-service/profile" works
app.use('/api', route);

// --- Start the Server ---
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})