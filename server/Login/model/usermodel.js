const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // This is the new, most important field.
  // It connects this user profile to the user in Clerk's database.
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
  
  // We still store the role in our database
  role: {
    type: String,
    required: true,
    enum: ["Learner", "Professional"] // Removed "Admin" for now unless you need it
  },

  // All your onboarding fields are perfect
  address: { type: String },
  interest: [String], // For Learners
  field: { // For Professionals (fixed typo from 'feild')
    type: String
  },
  experience: { // For Professionals
    type: Number
  },
  contact: {
    type: Number
  },
  district: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: { type: String }
},
{
  timestamps: true,
});

module.exports = mongoose.model("Users", userSchema);