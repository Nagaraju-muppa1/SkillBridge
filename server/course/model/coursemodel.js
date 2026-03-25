const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    // Professional Info
    clerkUserId: {
      type: String,
      required: true
    },

    UserId: {
      type: String
    },

    // Course Details
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    videoUrl: {
      type: String
    },

    thumbnail: {
      type: String
    },

    // 🔥 MAIN FIELD (IMPORTANT)
    visibility: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public"
    },

    // For paid courses
    price: {
      type: Number,
      default: 0
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("courses", courseSchema);