const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  UserId: {
    type: String,
   
    required: true
  },

  title: String,
  skill: String,

  videoType: {
    type: String,
    enum: ["demo", "main"],
    required: true
  },

  videoUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Videos", videoSchema);
