const userModel = require('../model/usermodel.js');
const Counter = require('../model/counterSchema.js')
const profileSetup = require('../model/profileSetup.js')



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
   
    const UserId = req.params.id;
    console.log(UserId);
    const found = await userModel.findOne({UserId:UserId});
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

const getName = async(req,res)=>{
   try{
      const UserId = req.params.UserId;
      console.log(UserId);
      const data = await userModel.find({UserId:UserId});
      console.log(data[0].fullname);
      return res.status(200).json({
         success:"true",
         message: data[0].fullname
      })

   }catch(error){
      console.log(error);
      return res.status(404).json({
         sucess:"false",
         message:"Error while fetching the data."
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
const getProfessional = async(req,res)=>{
  try{
      const { skill = "", name = "", type = "skill", query = "" } = req.query;
      const searchValue = String(query || (type === "name" ? name : skill)).trim();
      const searchField = type === "name" ? "fullname" : "skill";

      const filter = {
        $or: [
          { role: "professional" },
          { UserId: { $regex: "^PF", $options: "i" } }
        ]
      };

      if (searchValue) {
        filter[searchField] = { $regex: searchValue, $options: "i" };
      }

      const details = await userModel.find(filter);

    if (details.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No slots found for this skill",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      data: details
    });

  }catch(error){
    console.log(error);
    res.status(404).json({
      success:false,
      message:"Error"
    })
  }
}
const profile = async(req,res)=>{
  try {
    const id=req.params._id;
    console.log(id);
    const user = await userModel.findById({_id:id});

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Professional not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
}
}

const followProfessional = async (req, res) => {
  try {
    const { professionalId, followerId } = req.body;

    if (!professionalId || !followerId) {
      return res.status(400).json({
        success: false,
        message: "professionalId and followerId are required"
      });
    }

    const professional = await userModel.findOne({ UserId: professionalId });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found"
      });
    }

    if (!professional.followers.includes(followerId)) {
      professional.followers.push(followerId);
      await professional.save();
    }

    return res.status(200).json({
      success: true,
      message: "Connected successfully",
      followersCount: professional.followers.length,
      followers: professional.followers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while connecting"
    });
  }
};

const unfollowProfessional = async (req, res) => {
  try {
    const { professionalId, followerId } = req.body;

    if (!professionalId || !followerId) {
      return res.status(400).json({
        success: false,
        message: "professionalId and followerId are required"
      });
    }

    const professional = await userModel.findOne({ UserId: professionalId });
    if (!professional) {
      return res.status(404).json({
        success: false,
        message: "Professional not found"
      });
    }

    professional.followers = (professional.followers || []).filter(
      (id) => id !== followerId
    );
    await professional.save();

    return res.status(200).json({
      success: true,
      message: "Disconnected successfully",
      followersCount: professional.followers.length,
      followers: professional.followers
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while disconnecting"
    });
  }
};
const getConnections = async (req, res) => {
  try {
    const learnerId = req.params.learnerId;
    const data = await userModel.find({
      role: "professional",
      followers: learnerId
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching connections"
    });
  }
};
module.exports = { saveProfile,profileEdit,getDetails,getRole,getProfessional,profile, getName, followProfessional, unfollowProfessional, getConnections};