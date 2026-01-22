const { getAuth } = require("@clerk/clerk-sdk-node");
const User = require("../model/usermodel.js"); // your user model

// Middleware to check authentication and optionally roles
const authMiddleware = (requiredRole = null) => {
  return async (req, res, next) => {
    try {
      const { userId } = getAuth(req); // get user ID from Clerk session
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // attach user info to request
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = user;

      // if a role is required, check it
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: "Access denied" });
      }

      next(); // user is authenticated (and has correct role if required)
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = authMiddleware;
