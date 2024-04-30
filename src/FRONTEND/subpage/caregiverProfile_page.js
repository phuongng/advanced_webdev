import React, { useState, useEffect } from 'react';
import Navbar from "../components/navbar";
import { FaStar } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { RiMessage2Fill } from "react-icons/ri";
import "../subpage/subpage_css/caregiverProfile.css";
import api from '../../api.js';
import { useParams } from 'react-router-dom';

function CaregiverProfile() {
    const { fullname } = useParams();
    const [caregiverData, setCaregiverData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        // Fetch the caregiver data from API based on caregiver name
        api.get(`/caregiver?name=${fullname}`)
            .then((response) => {
                console.log("API Response:", response.data);
                setCaregiverData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('API Error:', error);
                setError(error);
                setLoading(false);
            });
    }, [fullname]);
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading data!</div>;
    }

    if (!caregiverData || !caregiverData.caregiver) {
        return <div>No data found.</div>;
    }

    // Destructure the caregiverData object to simplify access
    const {
        caregiver_name: caregiverName,
        title: caregiverTitle,
        rating,
        reviews,
        //total_patients: totalPatients,
        year_experience: yearsExperience,
        //about_me: aboutMe,
        skills: servicesOffered,
        //image
    } = caregiverData.caregiver;

    //TODO add these to the caregiver?
    var totalPatients;
    var aboutMe;
    var image;

    return (
        <>
            <Navbar />
            <div className="caregiver-profile">
                <div className="caregiver-profile-1">
                    <div className='caregiverProfile-image-container'>
                        {/* Assuming caregiverData has an image URL property */}
                        <img className="caregiverProfiler-image" src={image} alt="Caregiver Profile" />
                    </div>
                
                    <div className="caregiver-name">
                        <p className='giver-name'>{caregiverName}</p>
                        <p className='giver-title'>{caregiverTitle && caregiverTitle.length > 0 ? caregiverTitle[0] : 'No Title'}</p>
                        <div>
                            <FaStar /> <span>{`${rating} / 5 (${reviews} reviews)`}</span>
                            <br/>
                        </div>
                    </div>
                </div>

                <div className="caregiver-profile-2">
                    <div className="caregiver-profile-2-container" >
                        <div className="profile-2-icon-container"> 
                            <FaUser className="profile-2-icon" />
                        </div>
                    
                        <p>{totalPatients}+</p>
                        <p>Patients</p>
                    </div>

                    <div className="caregiver-profile-2-container">
                        <div className="profile-2-icon-container">
                            <FaCalendarCheck className="profile-2-icon"/>
                        </div>
                    
                        <p>{yearsExperience}+</p>
                        <p>Years</p>
                    </div>

                    <div className="caregiver-profile-2-container" >
                        <div className="profile-2-icon-container">
                            <FaStar className="profile-2-icon"/> 
                        </div>
                            
                        <p>{rating}</p>
                        <p>Rating</p>
                    </div>

                    <div className="caregiver-profile-2-container">
                        <div className="profile-2-icon-container">
                            <RiMessage2Fill className="profile-2-icon"/> 
                        </div>
                    
                        <p>{reviews}+</p>
                        <p>Reviews</p>
                    </div>  
                </div>
                
                <div className="caregiver-profile-3">
                    <h3>About me</h3>
                    <p>{aboutMe}</p>
                </div>

                <div className="caregiver-profile-4">
                    <h3>Services Offered</h3>
                    <div className="service-list">
                        {servicesOffered.map((service, index) => (
                            <p key={index}>{service}</p>
                        ))}
                    </div>
                </div>

                <div>
                    <button className='big-button'><a href="/booking">Schedule Services</a></button>
                </div>
            </div>
        </>
    );
}

export default CaregiverProfile;
