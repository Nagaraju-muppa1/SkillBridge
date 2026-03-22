const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    learnerId: {
      type: String,
      required: true,
    },
    learnerName:{
      type:String,
    },
    profName:{
      type:String,
    },
    professionalId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    day: {
      type: String, 
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed","Cancelled"],
      default: "Pending",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);