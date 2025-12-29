const express = require('express');
const route = express.Router();
const {Signature}=require('../controller/getSignature.js')
const {create,getPosts,deletePost} = require('../controller/createpost.js')
route.get('/signature',Signature);
route.post('/create',create);
route.get('/getPosts/:id',getPosts)
route.delete('/delete/:id',deletePost);
module.exports = route;