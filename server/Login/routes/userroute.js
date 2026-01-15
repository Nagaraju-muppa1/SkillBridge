const express = require('express');
const route = express.Router();
const { saveProfile,profileEdit,getDetails,getRole } = require('../controller/profilecontroller.js');
route.put('/user-service/profile', saveProfile);
route.get('/userdetails/:id',getDetails)
route.put('/profile-updating/:id',profileEdit)
route.get('/getRole/:id',getRole);

module.exports = route;