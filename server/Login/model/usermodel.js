const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
  fullname:{
    type:String,
  },
  username:{
    type:String,
  },
  email:{
    type:String,
  },
  password:{
    type:String,
  },
  role: {
    type: String,
    required: true,
    enum: ["Learner", "Professional"] // Removed "Admin" for now unless you need it
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model("Users", userSchema);