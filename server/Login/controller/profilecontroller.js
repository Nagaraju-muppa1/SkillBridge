const userModel = require('../model/usermodel.js');
const profileSetup = require('../model/profileSetup.js')

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
const getDetails = async(req,res)=>{
  try{
    const {email,password}=req.body;
    const found = await userModel.findOne({email:email});
    if(!found){
       return res.status(201).json({
        success:false,
        message:"Invalid Email"
       })
    }
    if(password != found.password){
      return res.status(201).json({
        success:false,
        message:"Incorrect Password"
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

const profileSetups = async(req,res)=>{
  try{
    const {clerkId,city,district,state,pincode,country,address,skill,experience,skilllevel,mode,availabledays,timeslots,languages,bio} = req.body;
    console.log(req.body);
    const profile = new profileSetup({
      clerkId,
      city,
      district,
      state,
      pincode,
      country,
      address,
      skill,
      experience,
      skilllevel,
      mode,
      availabledays,timeslots,languages,bio
    })
    const saved = await profile.save();
    return res.status(200).json({
      success:true,
      message:"Profile data saved Successfully"
    })
  }catch(error){
    console.log(error);
    return res.status(404).json({
      success:false,
      message:"Error occured while saving the data"
    })
  }
}

const profileEdit = async(req,res)=>{
  try{
    const clerkId = req.params.id;
    const newData = req.body;
    const found = await profileSetup.findOne({clerkId:clerkId});
    if(!found){
      return res.status(201).json({
        success:false
      })
    } 
    //console.log(found._id);
    const updatedDoc = await profileSetup.findByIdAndUpdate(
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

module.exports = { saveProfile,profileSetups,profileEdit,getDetails};