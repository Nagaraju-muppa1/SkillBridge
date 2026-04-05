const postSchema = require('../models/postmodel');
const create= async(req,res)=>{
     try{
        const {clerkUserId,UserId,imageUrl,content}=req.body;
        console.log(clerkUserId+" "+imageUrl+" "+content);
        const  newData = new postSchema({
            clerkUserId,
            UserId,
            imageUrl,
            content,
            skill
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

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const updatedPost = await postSchema.findByIdAndUpdate(
      id,
      {
        $set: req.body   // 🔥 updates only provided fields
      },
      {
        new: true        // return updated document
      }
    );

    if (!updatedPost) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postSchema.find().sort({ createdAt: -1 }); 
    // 🔥 latest posts first

    res.status(200).json({
      message: "Posts fetched successfully",
      data: posts
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server error while fetching posts"
    });
  }
};


module.exports = {create,getPosts,deletePost,updatePost,getAllPosts};