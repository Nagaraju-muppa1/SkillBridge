const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
  },
  UserId: {               
        type: String,
        unique: true
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
  mobileno:{
    type:String,
  },
  role: {
    type: String,
    required: true,
    enum: ["learner", "professional"] // Removed "Admin" for now unless you need it
  },
    village:{
      type:String,
    },
    city:{
        type:String,
    },
    district:{
        type:String,
    },
    state:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    country:{
        type:String,
    },
    address:{
        type:String,
    },
    skill:{
        type:String
    },
    experience:{
        type:Number
    },
    skilllevel:{
        type:String,
        enum:["Basic","Medium","Advanced"],
    },
    mode:{
        type:[String],
    },
    availabledays:{
        type:[String],
    },
    timeslots:{
        type:[String],
    },
    languages:{
        type:[String],
    },
    bio:{
        type:String,
    }
},
{
  timestamps: true,
});

module.exports = mongoose.model("Users", userSchema);