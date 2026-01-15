 
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({

    clerkId: {
        type: String,
    },

    UserId: {               // 🔥 ADDED
        type: String,
        unique: true
    },

    role: {                       // 🔥 REQUIRED FOR PREFIX
        type: String,
        enum: ["professional", "learner"],
        required: true
    },

    city: String,
    district: String,
    state: String,
    pincode: Number,
    country: String,
    address: String,
    skill: String,
    experience: Number,
    skilllevel: {
        type: String,
        enum: ["Basic", "Medium", "Advanced"],
    },
    mode: [String],
    availabledays: [String],
    timeslots: [String],
    languages: [String],
    bio: String

}, { timestamps: true });

module.exports = mongoose.model("profiles", profileSchema);
// const mongoose = require('mongoose');
// const profileSchema=mongoose.Schema({
//     clerkId:{
//         type:String,
//     },
//     city:{
//         type:String,
//     },
//     district:{
//         type:String,
//     },
//     state:{
//         type:String,
//     },
//     pincode:{
//         type:Number,
//     },
//     country:{
//         type:String,
//     },
//     address:{
//         type:String,
//     },
//     skill:{
//         type:String
//     },
//     experience:{
//         type:Number
//     },
//     skilllevel:{
//         type:String,
//         enum:["Basic","Medium","Advanced"],
//     },
//     mode:{
//         type:[String],
//     },
//     availabledays:{
//         type:[String],
//     },
//     timeslots:{
//         type:[String],
//     },
//     languages:{
//         type:[String],
//     },
//     bio:{
//         type:String,
//     }

// },{timestamps:true});

// module.exports = mongoose.model("profiles", profileSchema);