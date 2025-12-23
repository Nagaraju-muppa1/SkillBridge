const express = require('express');
const proxy = require('../utils/userproxy')
const route = express.Router();
route.use(proxy)
module.exports = route;