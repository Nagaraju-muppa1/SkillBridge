const express = require("express");
const router = express.Router();
const {slots}= require("../controller/available");
router.post("/saveSlots",slots);
module.exports = router;