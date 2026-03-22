const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  
  receiverId: {
    type: String,
    required: true
  },

  senderId: {
    type: String
  },


  senderName: {
    type: String
  },
  
  recieverName:{
    type:String
  },
  // 🔹 Notification title
  title: {
    type: String,
    required: true
  },

  // 🔹 Message content
  message: {
    type: String,
    required: true
  },

  // 🔹 Type of notification (VERY IMPORTANT)
  type: {
    type: String,
    enum: [
      "REQUEST",
      "ACCEPTED",
      "REJECTED",
      "CANCELLED",
      "STARTED",
      "COMPLETED"
    ],
  },

  // 🔹 Read status
  isRead: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("notifications", notificationSchema);