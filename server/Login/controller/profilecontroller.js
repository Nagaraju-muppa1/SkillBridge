const userModel = require('../model/usermodel.js');

const saveProfile = async (req, res) => {
  try {
    const profileData = req.body;
    console.log('Backend received profile data:', profileData);

    const userProfile = await userModel.findOneAndUpdate(
      { clerkUserId: profileData.clerkUserId }, // Find user by Clerk ID
      profileData, // Update with all form data
      { new: true, upsert: true } // Create them if they don't exist
    );

    res.status(201).json(userProfile);

  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ message: "Error saving profile to database" });
  }
};

module.exports = { saveProfile };