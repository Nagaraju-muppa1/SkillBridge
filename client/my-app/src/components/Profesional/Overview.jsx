import React from 'react';
import {useState,useEffect} from 'react';
import "./Overview.css"
import axios from 'axios';
function Overview(){
    const[name,setName]=useState("");
    const userData = JSON.parse(localStorage.getItem("customer"));
    const clerkUserId = userData.clerkUserId;
    useEffect(()=>{
        const getName = async()=>{
            const response = await axios.get(`http://localhost:5001/userdetails/${clerkUserId}`);
            setName(response.data.message.fullname);
        }
        getName();
    },[])
    return(
        <>
            <h2>Welcome {name}.</h2>
            <div className="overview-cards">
            <div className="card">
                <div className="card-title">Total Students</div>
                <div className="card-value">124</div>
            </div>

            <div className="card">
                <div className="card-title">Active Courses</div>
                <div className="card-value">6</div>
            </div>

            <div className="card">
                <div className="card-title">Upcoming Sessions</div>
                <div className="card-value">3</div>
            </div>

            <div className="card">
                <div className="card-title">Unread Messages</div>
                <div className="card-value">5</div>
            </div>
            </div>
        </>
    )
}

export default Overview;