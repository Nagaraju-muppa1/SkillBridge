import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        const clerkUserId = "PF123"; // later replace with localStorage value
        const response = await axios.get(
          `http://localhost:5001/userdetails/${clerkUserId}`
        );
        //console.log(response.data.message);
        const profileData = response.data.message;
        setProfile(profileData);
       // console.log(profile);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    getDetails();
  }, []);
  useEffect(() => {
  if (profile) {
    console.log("Profile state after render:", profile); // ✅ correct state
  }
  }, [profile]);

  if (loading) return <h2>Loading profile...</h2>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>

      <div className="profile-card">
        <p><strong>Full Name:</strong> {profile.fullname}</p>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Skill:</strong> {profile.skill}</p>
        <p><strong>Experience:</strong> {profile.experience} years</p>
        <p><strong>Bio:</strong> {profile.bio}</p>

        <hr />

        <p><strong>Address:</strong></p>
        <p>
          {profile.village}, {profile.city}, {profile.district},
          {profile.state}, {profile.country} - {profile.pincode}
        </p>

        <hr />

        <p><strong>Available Days:</strong></p>
        <ul>
        {profile?.availabledays?.length > 0 ? (
            profile.availabledays.map((day, index) => (
            <li key={index}>{day}</li>
            ))
        ) : (
            <li>No availability provided</li>
        )}
        </ul>


        <p><strong>Mode:</strong> {profile?.mode?.join(", ") || "Not specified"}</p>
      </div>
    </div>
  );
}

export default Profile;
