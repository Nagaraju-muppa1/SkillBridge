const available = require("../model/availability");
const slots = async(req, res)=>{
  //Saving the user available time slots in the backend
  try{
    const {availability} = req.body;
    let arr = [];
    for(const day of availability ){
         const {UserId,dayOfWeek,slots}=day;
         for(const slot of slots){
           arr.push({
            UserId:UserId,
            day:dayOfWeek,
            startTime:slot.startTime,
            endTime:slot.endTime
           })
         }
    }
    const save = await available.insertMany(arr);
    console.log(save);
    return res.status(200).json({
        success:true,
        message:"successfully saved"
    })
  }catch(error){
    console.log(error);
    return res.status(404).json({
        success:false,
        message:"Error"
    })
  }
}

const getSlots = async(req,res)=>{
  //Retreive the professional available time slots and display on the ui.
   try{
    const UserId = req.params.UserId;
    console.log(UserId);
    const userSlots = await available.find({UserId:UserId});
    console.log(userSlots);
    if(!userSlots){
      return res.status(200).json({
        success:true,
        message:"The Professional do not have any slots"
      })
    }
    return res.status(200).json({
      success:true,
      message:userSlots
    })

   }catch(error){
      console.log(error);
      return res.status(404).json({
        success:false,
        message:"Error occured"
      })
   }
}

module.exports = {slots,getSlots};