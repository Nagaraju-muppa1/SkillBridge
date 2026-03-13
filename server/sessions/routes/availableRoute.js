const express = require("express");
const router = express.Router();
const {slots,getSlots}= require("../controller/available");
router.post("/saveSlots",slots);
router.get("/getSlots/:UserId",getSlots);
module.exports = router;