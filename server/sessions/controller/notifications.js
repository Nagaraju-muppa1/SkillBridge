const notification = require('../model/notifications');

const Notification = require('../model/notifications');

// 🔹 Save Notification
const saveNotifications = async (req, res) => {
  try {
    const {
      receiverId,   
      senderId,
      senderName,
      recieverName, 
      title,
      message,
      type
    } = req.body;
    console.log(req.body);

    if (!receiverId || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }
    const notification = await Notification.create({
      receiverId,
      senderId,
      senderName,
      recieverName,
      title,
      message,
      type,
      isRead: false 
    });

    res.status(201).json({
      success: true,
      message: "Notification saved successfully",
      data: notification
    });

  } catch (error) {
    console.log("Error saving notification:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


//setting the isRead to read.
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Marked as read",
      data: notification
    });

  } catch (error) {
    console.log("Error updating notification:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


//fetching all the messages

const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      receiverId: userId
    }).sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.log("Error fetching notifications:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 🔹 Get unread notifications count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    // 🔥 Count only unread notifications
    const count = await Notification.countDocuments({
      receiverId: userId,
      isRead: false
    });

    res.status(200).json({
      success: true,
      count: count
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching unread count"
    });
  }
};

module.exports = { saveNotifications, markAsRead,getNotifications,getUnreadCount};