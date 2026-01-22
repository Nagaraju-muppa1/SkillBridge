const express = require("express");
const router = express.Router();

const {
  uploadVideo,
  getProfessionalVideos,
  searchProfessionals
} = require("../controller/VideoController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * Professional uploads video
 */
router.post("/upload", authMiddleware, uploadVideo);

/**
 * Learner views professional videos
 */
router.post("/professional", getProfessionalVideos);


router.get("/search", searchProfessionals);


module.exports = router;
