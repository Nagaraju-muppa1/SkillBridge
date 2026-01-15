const courseSchema = require('../model/coursemodel.js');

const upload = async(req,res)=>{
    try{
        const {clerkUserId,videoUrl,description}=req.body;
        const newData = new courseSchema({
            clerkUserId,
            videoUrl,
            description
        })
        const response = newData.save();
        return res.status(200).json({
            success:true,
            message:"Successfully saved"
        })
    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Error Occured."
        })
    }
}

const getCourses = async(req,res)=>{
    try{
        const clerkUserId = req.params.id;
        const data = await courseSchema.find({clerkUserId:clerkUserId});
        if(!data){
            return res.status(201).json({
                success:false,
                message:"No courses Yet."
            })
        }
        return res.status(200).json({
            success:true,
            message:"successfully send",
            data:data
        })

    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Error occured"
        })
    }
}

const deleteCourse = async(req,res)=>{
    try{
        const id = req.params.id;
        const data = await courseSchema.findByIdAndDelete({_id:id});
        if(!data){
            return res.status(201).json({
                status:false,
                message:"id is not find"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Successfully deleted"
        })

    }catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:"Error occured"
        })
    }
}

module.exports = {upload,getCourses,deleteCourse}