import { useState, useEffect } from "react";
import axios from "axios";
import "./Course.css";

function Courses() {
  const [videos, setVideos] = useState([]);
  const [popup, setPopUpOpen] = useState(false);
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");

  const { UserId, clerkUserId, role } = JSON.parse(
    localStorage.getItem("customer")
  );

  // ✅ GET COURSES
  const getCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5003/getCourses/${clerkUserId}`
      );
      setVideos(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ UPLOAD VIDEO
  const uploadVideo = async () => {
    try {
      if (!file) {
        return alert("Please select a video.");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "skillbridge_videos");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/duwwsrzyp/video/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const uploadUrl = response.data.secure_url;

      await axios.post("http://localhost:5003/upload", {
        clerkUserId,
        UserId,
        videoUrl: uploadUrl,
        description: content,
        title,
        visibility
      });

      setPopUpOpen(false);
      setContent("");
      setFile("");
      setTitle("");
      setVisibility("public");

      getCourses();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      {/* Upload Button */}
      {role === "professional" && (
        <button onClick={() => setPopUpOpen(true)}>Upload</button>
      )}

      {/* Modal */}
      {popup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Upload Course</h4>

            <input
              type="text"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Description..."
            />

            {/* Visibility */}
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="public">🌍 Public</option>
              <option value="followers">👥 Followers Only</option>
              <option value="private">🔒 Private (Paid)</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setPopUpOpen(false)}>Close</button>
              <button onClick={uploadVideo}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Courses */}
      <div className="video-section">
        {videos.length === 0 ? (
          <div className="no-videos">
            <p>No Courses Yet</p>
          </div>
        ) : (
          <div className="video-grid">
            {videos.map((video, index) => (
              <div className="video-card" key={index}>

                {/* ✅ PROFESSIONAL → ALWAYS SHOW VIDEO */}
                {role === "professional" ? (
                  <video className="video-player" controls>
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  // 👇 LEARNER VIEW
                  video.access ? (
                    <video className="video-player" controls>
                      <source src={video.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="locked-video">
                      <p>🔒 Locked Content</p>
                    </div>
                  )
                )}

                <div className="video-info">
                  <h4>{video.title}</h4>

                  <p className="video-description">
                    {video.description || "No description available"}
                  </p>

                  {/* ✅ Visibility tag (only for professional) */}
                  {role === "professional" && (
                    <p className="visibility-tag">
                      {video.visibility === "public" && "🌍 Public"}
                      {video.visibility === "followers" && "👥 Followers"}
                      {video.visibility === "private" && "🔒 Private"}
                    </p>
                  )}

                  {/* ✅ Unlock button (only for learner) */}
                  {role !== "professional" && !video.access && (
                    <button className="unlock-btn">
                      {video.visibility === "followers"
                        ? "Follow to Unlock"
                        : "Subscribe to Unlock"}
                    </button>
                  )}

                  {/* ✅ Edit/Delete (only for professional) */}
                  {role === "professional" && (
                    <div className="video-actions">
                      <button>Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Courses;