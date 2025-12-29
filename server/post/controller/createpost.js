const postSchema = require('../models/postmodel');
const create= async(req,res)=>{
     try{
        const {clerkUserId,imageUrl,content}=req.body;
        console.log(clerkUserId+" "+imageUrl+" "+content);
        const  newData = new postSchema({
            clerkUserId,
            imageUrl,
            content
        })
        const saved=await newData.save();
        return res.status(200).json({
            success:true,
            message:"Successfully saved"
        })

     }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Error occured"
        })
     }

}

const getPosts = async(req,res)=>{
    try{
        const clerkUserId = req.params.id;
        //console.log(clerkUserId);
        const data = await postSchema.find({clerkUserId:clerkUserId});
        //console.log(data);
        return res.status(200).json(
            {
                success:true,
                message:"successfully send",
                data:data
            }
        )

    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Error occured"
        })
    }
}
const deletePost = async(req,res)=>{
    try{
        const postid = req.params.id;
        console.log(postid);
        const data = await postSchema.findByIdAndDelete({_id:postid});
        return res.status(200).json({
            success:true,
            message:"Successfully deleted",
            data:data
        })
    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Error Occured"
        })
    }
}
module.exports = {create,getPosts,deletePost};