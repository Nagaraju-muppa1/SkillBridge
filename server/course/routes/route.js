const express = require('express');
const route = express.Router();
const {Signature} = require('../controller/createSignature.js')
route.get('/signature',Signature)
module.exports = route;