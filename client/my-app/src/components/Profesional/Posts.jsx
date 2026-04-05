import { useState, useEffect } from "react";
import axios from "axios";
import "./Post.css";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [popup, setPopUpOpen] = useState(false);
  const [content, setContent] = useState("");
  const [ProfessionaName, setPName] = useState("");
  const [skill,setSName] = useState("");

  const { UserId, clerkUserId, role } = JSON.parse(
    localStorage.getItem("customer")
  );

  console.log(UserId + " " + clerkUserId);

  // ✅ TIME FORMAT FUNCTION
  const formatTime = (time) => {
    if (!time) return "";

    const now = new Date();
    const postTime = new Date(time);

    const diff = Math.floor((now - postTime) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 172800) return "Yesterday";

    return postTime.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const deletePost = async (postid) => {
    try {
      await axios.delete(`http://localhost:5002/delete/${postid}`);
      getPost();
    } catch (error) {
      console.log(error);
    }
  };

  const getPost = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5002/getPosts/${clerkUserId}`
      );
      setPosts(res.data.data);
      const response = await axios.get(`http://localhost:5001/userdetails/${UserId}`)
      console.log(response.data.message.fullname);
      setPName(response.data.message.fullname);
      setSName(response.data.message.skill);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPost = async () => {
    const file = document.getElementById("imageInput").files[0];

    if (file) {
      const sigRes = await axios.get("http://localhost:5002/signature");
      const signData = sigRes.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", signData.apiKey);
      formData.append("timestamp", signData.timestamp);
      formData.append("signature", signData.signature);
      formData.append("folder", "skillbridge_posts");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          formData
        );

        const newdata = {
          clerkUserId,
          UserId,
          imageUrl: response.data.secure_url,
          content,
          skill
        };

        await axios.post("http://localhost:5002/create", newdata);
        setPopUpOpen(false);
        setContent("");
        getPost();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const newdata = {
          clerkUserId,
          UserId,
          content,
          skill
        };
        await axios.post("http://localhost:5002/create", newdata);
        setPopUpOpen(false);
        setContent("");
        getPost();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="feed-container">
      {/* Create Post Box */}
      <div className="create-post-box">
        <div className="create-top">
          <div className="avatar"></div>
          <button onClick={() => setPopUpOpen(true)}>
            Start a post...
          </button>
        </div>
      </div>

      {/* Modal */}
      {popup && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Create Post</h4>
            <input type="file" id="imageInput" />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share something..."
            />

            <div className="modal-actions">
              <button onClick={() => setPopUpOpen(false)}>Cancel</button>
              <button onClick={uploadPost}>Post</button>
            </div>
          </div>
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            {/* Header */}
            <div className="post-header">
              <div className="avatar small">
                <img src="" alt="" />
              </div>
              <div>
                <h4>{ProfessionaName}</h4>

                {/* ✅ REAL TIME DISPLAY */}
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>

            {/* Content */}
            <p>{post.content}</p>

            {/* Image */}
            {post.imageUrl && (
              <div className="post-media">
                <img src={post.imageUrl} alt="Post" />
              </div>
            )}

            {/* Footer */}
            <div className="post-footer">
              <div className="post-actions">
                <button>👍 Like</button>
                <button>💬 Comment</button>
                <button>🔁 Share</button>
              </div>

              <div className="post-actions right">
                <button>Edit</button>
                <button onClick={() => deletePost(post._id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Posts;