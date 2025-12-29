import {useState,useEffect} from 'react';
import axios from 'axios';
import './Post.css';
function Posts(){
      const [posts, setPosts] = useState([]);
      const [popup,setPopUpOpen]=useState(false)
      const [content,setContent]=useState('');
      const deletePost = async(postid)=>{
        try{
        console.log(postid);
        const res = await axios.delete(`http://localhost:5002/delete/${postid}`)
        console.log(res);
        getPost();
        }catch(error){
            console.log(error);
        }
      }
      const getPost = async()=>{
        try{
        const clerkUserId="PF123";
        const res = await axios.get(`http://localhost:5002/getPosts/${clerkUserId}`);
        console.log(res);
        setPosts(res.data.data);
        }catch(error){
        console.log(error);
        }
       }
      const uploadPost = async()=>{
            const file = document.getElementById("imageInput").files[0];
            if(file){
            const sigRes = await axios.get('http://localhost:5002/signature');
            const signData = sigRes.data;
            console.log(signData);
            const formData = new FormData();
            formData.append("file",file);
            formData.append("api_key",signData.apiKey);
            formData.append("timestamp",signData.timestamp);
            formData.append("signature",signData.signature);
            formData.append('folder', 'skillbridge_posts');
            try{
            const response=await axios.post(`https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,formData);
            console.log(response);
            const newdata ={
                    clerkUserId:"PF123",
                    imageUrl:response.data.secure_url,
                    content
            }
            const res = await axios.post('http://localhost:5002/create',newdata);
            console.log(res);

                }catch(error){
                console.log(error);
                }
            }
            else{
                try{
                const newdata ={
                        clerkUserId:"PF123",
                        content
                }
                const res = await axios.post('http://localhost:5002/create',newdata);
                console.log(res);

                }catch(error){
                    console.log(error);
                }
            }
       }
      useEffect(()=>{
        getPost();
      },[]);
    return(
        <>
        <div>
             <div className="content-box"> <button onClick={()=> setPopUpOpen(true)}>create</button>
              {/* {getPost()} */}
              </div>;
            {popup && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h2>Create Post</h2>

                <input type="file" id="imageInput" />
                <textarea  value={content} onChange ={(e)=>setContent(e.target.value)} placeholder="Write something..." />

                <div className="modal-actions">
                  <button onClick={() => setPopUpOpen(false)}>Close</button>
                  <button onClick={uploadPost}>Submit</button>
                </div>
              </div>
            </div>
          )}
           {posts.length === 0 ? <p>No posts yet</p> :
                posts.map(post => (
                    <div key={post._id} className="post-card">
                    {post.imageUrl !== undefined && (<div className="post-media">
                        <img src={post.imageUrl} alt="Post" />
                    </div>)}
                    <p>{post.content}</p>
                    <div className="post-footer">
                        {/* Left side - comments count placeholder */}
                        <div className="post-comments">💬 0 Comments</div>

                        {/* Right side - buttons */}
                        <div className="post-actions">
                            <button>Edit</button>
                            <button onClick={() => deletePost(post._id)}>Delete</button>
                            <button>Share</button>
                        </div>
                        </div>
                    </div>
         ))}
        </div>
        </>
    )

}
export default Posts;









