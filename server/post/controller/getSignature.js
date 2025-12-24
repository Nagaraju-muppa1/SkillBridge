const cloudinary = require('../utils/cloudinary');
const Signature = async(req,res)=>{
   try{
    const timestamp = Math.round(Date.now()/1000);
    const signature = cloudinary.utils.api_sign_request(
        {folder:'skillbridge_posts',timestamp},
        process.env.API_SECRET
    );
    return res.status(200).json({
         cloudName: process.env.CLOUD_NAME,
         apiKey: process.env.API_KEY,
         timestamp,
         signature,
    })

   }catch(error){
    console.log(error);
    return res.status(404).json({
        success:false,
        message:"error occured in getting signature"
    })
   }
}
module.exports = {Signature};