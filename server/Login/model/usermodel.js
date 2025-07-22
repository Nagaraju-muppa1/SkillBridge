const mongoose = require('mongoose');
const userSchema=mongoose.Schema({
    firstname:{
        type:String,
        require:[true,"Please provide first name"],
        trim:true,
        min: 3,
        max:50
    },
    lastname:{
        type:String,
        require:[true,"Please provide last name"],
        trim:true,
        min: 3,
        max:50
    },
    email:{
        type:String,
        require:[true,"Please provide email"],
        unique:true,
        trim:true,
        min:3,
        max:60
    },
    password:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        require:true,
        enum:["Admin","Learner","Professional"]
    },
    
    address:{type:String},
    interest:[String],
    feild:{
        type:String
    },
    experience:{
       type: Number
    },
    contact:{
      type: Number
    },
    district:{
        type:String
    },
    city:{
        type:String
    },
    state:{
        type:String
    },
    country:{type:String}

},
{
    timestamps:true,
})

module.exports=mongoose.model("Users",userSchema);