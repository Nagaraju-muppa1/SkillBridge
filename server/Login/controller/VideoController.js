const Video = require("../model/video");
const Users = require("../model/usermodel");
const { User } = require("@clerk/clerk-sdk-node");

/**
 * PROFESSIONAL uploads demo or main video
 */
const uploadVideo = async (req, res) => {
  try {
    if (req.user.role !== "professional") {
      return res.status(403).json({
        success: false,
        message: "Only professionals can upload videos",
      });
    }

    const { title, videoType, videoUrl } = req.body;

    if (!["demo", "main"].includes(videoType)) {
      return res.status(400).json({
        success: false,
        message: "videoType must be demo or main",
      });
    }

    const video = await Video.create({
      professionalId: req.user._id,
      title,
      skill: req.user.skill,
      videoType,
      videoUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error uploading video",
    });
  }
};

/**
 * GET professional videos
 * Learner:
 *   - Not followed → demo only
 *   - Followed → full playlist
 */
const getProfessionalVideos = async (req, res) => {
  try {
    const {UserId,learnerId,role} = req.body;
    console.log(learnerId,role,UserId)
    const professional = await Users.findOne({UserId:UserId});

    console.log(professional)
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found",
      });
    }

    let isFollower = false;

   if (role === "learner") {
  for (let i = 0; i < professional.followers.length; i++) {
    if (professional.followers[i]===learnerId) {
      isFollower = true;
      break;
    }
  }
}


    const videos = isFollower
      ? await Video.find({ UserId })
      : await Video.find({
          UserId,
          videoType: "demo",
        });

    return res.status(200).json({
      success: true,
      isFollower,
      videos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching videos",
    });
  }
};

const searchProfessionals = async (req, res) => {
  try {
    const { skill } = req.query;

    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    // case-insensitive search
    const professionals = await Users.find({
      role: "professional",
      skill: { $regex: skill, $options: "i" },
    }).select("-password");

    res.status(200).json({
      success: true,
      professionals,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search error" });
  }
};

module.exports = {
  uploadVideo,
  getProfessionalVideos,
  searchProfessionals,
};
