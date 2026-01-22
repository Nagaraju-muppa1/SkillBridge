import React, { useEffect, useState } from "react";
import axios from "axios";

function Courses({ professional }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!professional) return;

    const fetchVideos = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));

        const userId = customer?.UserId;
        const role = customer?.role;

        console.log(userId, role);

        const res = await axios.post(
          "http://localhost:5001/api/videos/professional",
          {
            UserId: professional.UserId,  // important
            learnerId: userId,
            role: "learner",
          }
        );
        console.log(res)
        setVideos(res.data.videos);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVideos();
  }, [professional]);

  if (!professional) return <h3>Select a professional</h3>;

  return (
    <div>
      <h2>{professional.name}'s Videos</h2>

      {videos.length === 0 ? (
        <p>No videos available</p>
      ) : (
        videos.map((video) => (
          <div key={video._id} style={{ marginBottom: "20px" }}>
            <h4>{video.title}</h4>
            <video width="400" controls>
              <source src={video.videoUrl} />
            </video>
          </div>
        ))
      )}
    </div>
  );
}

export default Courses;
