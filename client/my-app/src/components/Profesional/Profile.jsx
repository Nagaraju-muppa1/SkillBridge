import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editableFields, setEditableFields] = useState({});
  const [updatedFields, setUpdatedFields] = useState({});

  useEffect(() => {
    const getDetails = async () => {
      try {
        const clerkUserId = "PF123"; // replace with localStorage if needed
        const response = await axios.get(
          `http://localhost:5001/userdetails/${clerkUserId}`
        );
        setProfile(response.data.message);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };
    getDetails();
  }, []);

  const handleEditClick = (field) => {
    setEditableFields({ ...editableFields, [field]: true });
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setProfile({ ...profile, [field]: value });
    setUpdatedFields({ ...updatedFields, [field]: value });
  };

  const handleSubmit = async () => {
    if (Object.keys(updatedFields).length === 0) {
      alert("No changes made!");
      return;
    }

    try {
      console.log(updatedFields);
      const response = await axios.put(
        `http://localhost:5001/profile-updating/${profile.clerkUserId}`,
        updatedFields
      );
      alert("Profile updated successfully!");
      setEditableFields({});
      setUpdatedFields({});
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) return <h2>Loading profile...</h2>;

  const renderInput = (label, field, type = "text") => (
    <div className="profile-row">
      <label>{label}:</label>
      <input
        type={type}
        value={profile[field] || ""}
        readOnly={!editableFields[field]}
        onChange={(e) => handleChange(e, field)}
      />
      <button
        type="button"
        className="edit-btn"
        onClick={() => handleEditClick(field)}
      >
        Edit
      </button>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>Basic Info</h2>
        {renderInput("Full Name", "fullname")}
        {renderInput("Username", "username")}
        {renderInput("Email", "email", "email")}
        {renderInput("Role", "role")}
        {renderInput("Skill", "skill")}
        {renderInput("Experience (years)", "experience", "number")}
        {renderInput("Bio", "bio")}

        <h2>Address</h2>
        {renderInput("Village", "village")}
        {renderInput("City", "city")}
        {renderInput("District", "district")}
        {renderInput("State", "state")}
        {renderInput("Country", "country")}
        {renderInput("Pincode", "pincode")}

        <h2>Availability</h2>
        <div className="profile-row">
          <label>Available Days:</label>
          <ul className="array-field">
            {profile.availabledays?.map((day, idx) => (
              <li key={idx}>{day}</li>
            )) || <li>Not specified</li>}
          </ul>
        </div>
        <div className="profile-row">
          <label>Mode:</label>
          <ul className="array-field">
            {profile.mode?.map((m, idx) => (
              <li key={idx}>{m}</li>
            )) || <li>Not specified</li>}
          </ul>
        </div>

        <button type="button" className="save-btn" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default Profile;
