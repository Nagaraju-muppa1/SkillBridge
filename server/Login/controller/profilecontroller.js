require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../model/usermodel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { UsAppToPersonInstance } = require('twilio/lib/rest/messaging/v1/service/usAppToPerson.js');
const {JWT_SCRETE_TOKEN}=process.env;
// Middleware to extract token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SCRETE_TOKEN, (err, decoded) => {
    if (err) {
          console.error("JWT Error:", err);
           return res.sendStatus(403);
    }
     
    req.user = decoded;
    next();
  });
};
const profile = async(req,res)=>{
    const {address,interest,feild,experience,contact,district,city,state,country}=req.body;
    const User = await userModel.findOne({email:req.user.email})

    User.address = address;
    User.interest = interest;
    User.experience=experience;
    User.contact=contact;
    User.country=country;
    User.district=district,
    User.city=city;
    User.state=state;
    await User.save();
    console.log(User.district+" "+User.city+" "+User.state);

    res.json({ message: "Profile updated", user: User });
}
module.exports={authenticate,profile};