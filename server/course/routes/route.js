const express = require('express');
const route = express.Router();
const {Signature} = require('../controller/createSignature.js')
const {upload,getCourses,deleteCourse} = require('../controller/uploadVid.js')
route.get('/signature',Signature);
route.post('/upload',upload);
route.get('/getCourses/:id',getCourses);
route.delete('/delete/:id',deleteCourse);
module.exports = route;