const express = require('express');
const route = express.Router();
const { saveProfile,profileSetups,profileEdit,getDetails } = require('../controller/profilecontroller.js');
route.post('/user-service/profile', saveProfile);
route.post('/userdetails',getDetails)
route.post('/profile-setup',profileSetups);
route.put('/profile-updating/:id',profileEdit)

module.exports = route; 