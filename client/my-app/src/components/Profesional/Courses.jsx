import {useState,useEffect} from 'react';
import axios from 'axios';
import './Course.css'
function Courses(){
    const [videos,setVideos]=useState([]);
    const [popup,setPopUpOpen]=useState(false)
    const [content,setContent]=useState('');
    const [file,setFile]=useState('');
    const [video,setVideoUrl]=useState('');
    const getCourses = async()=>{
        try{
            const clerkUserId = "PF123"
            const response = await axios.get(`http://localhost:5003/getCourses/${clerkUserId}`);
            console.log(response);
            setVideos(response.data.data);
        }catch(error){
            console.log(error);
        }
    }
    const uploadVideo = async()=>{
        try{
            console.log(file);
           if(!file){
            return alert("Please select a video.");
           }
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", 'skillbridge_posts');
            const response=await axios.post(`https://api.cloudinary.com/v1_1/duwwsrzyp/video/upload`,formData,
                 { headers: { "Content-Type": "multipart/form-data" } }
            );
            console.log(response);
            const uploadUrl = response.data.secure_url;
            const sending = await axios.post('http://localhost:5003/upload',
                {
                    clerkUserId:"PF123",
                     videoUrl:uploadUrl,
                    description:content
                }
            )
            console.log(sending);

        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getCourses();
    },[]);

    return(
        <>
        <button onClick={()=>{setPopUpOpen(true)}}>upload</button>
         {popup && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h2>Upload Course</h2>

                <input type="file" accept="video/*" id="videoInput"  onChange={(e)=>{setFile(e.target.files[0])}}/>
                <textarea  value={content} onChange ={(e)=>setContent(e.target.value)} placeholder="Write something..." />

                <div className="modal-actions">
                  <button onClick={() => setPopUpOpen(false)}>Close</button>
                  <button onClick={uploadVideo}>Submit</button>
                </div>
              </div>
            </div>
          )}
        <div className="video-section">
        {videos.length === 0 ? (
            <div className="no-videos">
            <p>No Courses Yet</p>
            </div>
        ) : (
        <div className="video-grid">
        {videos.map((video, index) => (
            <div className="video-card" key={index}>
            <video className="video-player" controls>
                <source src={video.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

                    <div className="video-info">
                        <p className="video-description">
                        {video.description || "No description available"}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </>
    )

}

export default Courses;