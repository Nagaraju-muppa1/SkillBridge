const express = require('express');
const route = express.Router();

// 1. We ONLY import the new 'saveProfile' function from profilecontroller
const { saveProfile } = require('../controller/profilecontroller.js');

// 2. We DELETE the old signup/signin routes. Clerk handles this.
// route.post('/signup', signup); // <-- DELETE
// route.post('/signin', signin); // <-- DELETE

// 3. We create the EXACT route your frontend is calling:
// METHOD: POST
// PATH: /user-service/profile
// FUNCTION: saveProfile
route.post('/user-service/profile', saveProfile);

module.exports = route;