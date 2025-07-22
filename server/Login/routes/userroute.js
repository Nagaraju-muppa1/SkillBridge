const express = require('express');
const route = express.Router();
const {signup,signin}=require('../controller/usercontroller.js');
const {authenticate,profile}=require('../controller/profilecontroller.js')
route.post('/signup',signup);
route.post('/signin',signin);
route.put('/profile',authenticate,profile);
module.exports = route;