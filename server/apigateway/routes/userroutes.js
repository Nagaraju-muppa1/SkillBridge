const express = require('express');
const proxy = require('../utils/proxy')
const route = express.Router();
route.use(proxy)
module.exports = route;