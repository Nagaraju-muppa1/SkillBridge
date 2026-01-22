// const available = require("../model/availability");
// const slots = async(req, res)=>{
//   try{
//     const availability = req.body;
//     availability.foreach(day=>{
//         day.foreach(slot=>{
//             UserId:day.UserId,
//         })
//     })

//   }catch(error){
//     console.log(error);
//     return res.status(404).json({
//         success:false,
//         message:"Error"
//     })
//   }
// }

// module.exports = {slots};