import React, { useState } from 'react';
import "./navbar_css/dashboard.css";
import Navbar from "../components/navbar";
import { MdNotificationsNone } from "react-icons/md";
//import { MdNotificationsActive } from "react-icons/md";

function Home() {
	const [activeOptions, setActiveOptions] = useState([]);

	const handleClick = (id) => {
	  if (activeOptions.includes(id)) {
		setActiveOptions(activeOptions.filter(option => option !== id));
	  } else {
		setActiveOptions([...activeOptions, id]);
	  }
	};

	return(
		<>
	<div className="dashboard">
		<div className="dashboard-notification">
			<div className="small-profile-image">
				<img className="user-image"></img>
			</div>
			<div className="welcome-user">
			<p><b>Hello, user</b></p>
			<p>Welcome to your care dashboard!</p>
			</div>

			<div className="nofi-icon-container">
				<MdNotificationsNone className="nofi-icon" />
				{/* <MdNotificationsActive /> */}
			</div>
			
		</div>
		<div className="dashboard-services">
			<div className="get-started">
				<h3>Let's get started</h3>
				<p><b>Welcome to your care dashboard</b></p>
				<p>A space where you can review your bookings and specify your care preferences</p>
			</div>

			<div className="service-selection">
				<p className="blue-text"><b>What kind of services do you need?</b></p>
				<p className="light-text">Select your care preferences</p>

				<div className="service-list">
				<p className={activeOptions.includes('option5') ? 'active' : ''} onClick={() => handleClick('option5')}>Catheter Care</p>
				<p className={activeOptions.includes('option9') ? 'active' : ''} onClick={() => handleClick('option9')}>Chronic Disease Management</p>
				<p className={activeOptions.includes('option3') ? 'active' : ''} onClick={() => handleClick('option3')}>Errands</p>
				<p className={activeOptions.includes('option6') ? 'active' : ''} onClick={() => handleClick('option6')}>Emotional Support</p>
				<p className={activeOptions.includes('option4') ? 'active' : ''} onClick={() => handleClick('option4')}>Medication Management</p>
				<p className={activeOptions.includes('option2') ? 'active' : ''} onClick={() => handleClick('option2')}>Mobility Aid</p>
				<p className={activeOptions.includes('option8') ? 'active' : ''} onClick={() => handleClick('option8')}>Nutritional Counseling</p>
				<p className={activeOptions.includes('option1') ? 'active' : ''} onClick={() => handleClick('option1')}>Perconal Care Assistance</p>
				<p className={activeOptions.includes('option11') ? 'active' : ''} onClick={() => handleClick('option11')}>Physical Therapy</p>
				<p className={activeOptions.includes('option10') ? 'active' : ''} onClick={() => handleClick('option10')}>Rehabilitation Services</p>
				<p className={activeOptions.includes('option12') ? 'active' : ''} onClick={() => handleClick('option12')}>Respiratory Therapy</p>
				<p className={activeOptions.includes('option7') ? 'active' : ''} onClick={() => handleClick('option7')}>Wound Care Management</p>
				</div>
				
			<label className="light-text">Other, specify and select from list</label>
			<input type="text"></input>
			</div>

			<div className="button-container">
			<button className="big-button"><a href="/scheduling">Let's schedule it</a></button>
			</div>
		</div>
		
	</div>
	<Navbar />
	</>
	)
	
	
}

export default Home;
