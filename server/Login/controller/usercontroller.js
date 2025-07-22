require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../model/usermodel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {JWT_SCRETE_TOKEN}=process.env;

const signup = async(req,res)=>{
    const { firstname,lastname,email,password,role} = req.body;
   try{
        const userExist = await userModel.findOne({email});
        if(userExist){
            return res.status(400).json({
               Success: false,
               message: "User email already exists."
            })
        }
        const hashpassword= await bcrypt.hash(password,10);

        const user= new userModel({
            firstname,
            lastname,
            email,
            password:hashpassword,
            role,
        })

        const savedUser =await user.save();

        const token =jwt.sign({email,role},JWT_SCRETE_TOKEN)
        res.status(200).json({
            message:role, 
            token
        })
    }
    catch(error){
        console.log(error);
          return res.status(500).json({
            success: false,
            message: "Some error occurred while running. Contact your administrator.", 
        })
    }
}

const signin = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const userExist = await userModel.findOne({email});
        if(!userExist){
            return res.status(400).json({
                message:"user not exist!"
            })
        }
        if(!userExist.address){
            return res.status(200).json({
                message:"Please fill the details",
                role:userExist.role
            })
        }
        res.status(200).json({
            message:{userExist}
        })
    }
    catch(e){
        console.log(e);
        res.status(400).json({
            message:e
        })
    }

}


module.exports ={signup,signin};