const userModel = require('../model/usermodel.js');
const Counter = require('../model/counterSchema.js')
const profileSetup = require('../model/profileSetup.js')

// const saveProfile = async (req, res) => {
//   try {
//     const profileData = req.body;
//     console.log('Backend received profile data:', profileData);

//     const userProfile = await userModel.findOneAndUpdate(
//       { clerkUserId: profileData.clerkUserId }, // Find user by Clerk ID
//         profileData, // Update with all form data
//       { new: true, upsert: true } // Create them if they don't exist
//     );

//     res.status(201).json(userProfile);

//   } catch (error) {
//     console.error("Error saving profile:", error);
//     res.status(500).json({ message: "Error saving profile to database" });
//   }
// };

const saveProfile = async (req, res) => {
  try {
    const profileData = req.body;
    const { clerkUserId, role } = profileData;

    let user = await userModel.findOne({ clerkUserId });

    // 🔥 IF USER DOES NOT EXIST → CREATE WITH CUSTOM ID
    if (!user) {
      const prefix = role === "professional" ? "PF" : "LR";

      const counter = await Counter.findOneAndUpdate(
        { role },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );

     
      const UserId = `${prefix}${String(counter.seq).padStart(5, "0")}`;

      user = await userModel.create({
        ...profileData,
        UserId
      });

    } else {
      // 🔁 USER EXISTS → NORMAL UPDATE
      user = await userModel.findOneAndUpdate(
        { clerkUserId },
        profileData,
        { new: true }
      );
    }
    res.status(201).json({
      success:true,
      UserId : user.UserId,
      role: user.role, 
    });

  } catch (error) {
    console.error("Error saving profile:", error);
    res.status(500).json({ message: "Error saving profile to database" });
  }
};
//user details is retrieved.
const getDetails = async(req,res)=>{
  console.log("getdetails");
  try{
   
    const clerkUserId = req.params.id;
    console.log(clerkUserId);
    const found = await userModel.findOne({clerkUserId:clerkUserId});
    console.log(found);
    if(!found){
       return res.status(201).json({
        success:false,
        message:"Data Not Found"
       })
    }
    return res.status(200).json({
      success:true,
      message:found
    })

  }catch(error){
    console.log(error);
    return res.status(404).json({
      success:false,
      message:"Error Occured"
    })
  }
}

const profileEdit = async(req,res)=>{
  try{
    const clerkUserId = req.params.id;
    const newData = req.body;
    console.log(newData);
    const found = await userModel.findOne({clerkUserId:clerkUserId});
    console.log(found);
    if(!found){
      return res.status(201).json({
        success:false
      })
    } 
    const updatedDoc = await userModel.findByIdAndUpdate(
      found._id,
      {
        $set: newData
      },
      {
        new: true,        // return updated document
        runValidators: true
      }
    );
    console.log(updatedDoc);
    return res.status(200).json({
      success:true,
      message:"Updated Successfully"
    })

  }catch(error){
    console.log(error);
    return res.status(404).json({
      success:false,
      message:"Error occured"
    })
  }
}

const getRole = async(req,res)=>{
   try{
      const clerkUserId = req.params.id;
      const found = await userModel.findOne({clerkUserId:clerkUserId});
      console.log(found.role);
      return res.status(200).json({
        success:true,
        clerkUserId:found.clerkUserId,
        UserId:found.UserId,
        role:found.role
      })
   }catch(error){
      console.log(error);
      return res.status(404).json({
         success:false,
         message:"Error occured"
      })
   }
}

module.exports = { saveProfile,profileEdit,getDetails,getRole};