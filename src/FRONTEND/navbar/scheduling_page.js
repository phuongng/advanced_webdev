import React, { useState } from 'react';
import Navbar from "../components/navbar";
import Calendar from '../components/calendar';
import TimePicker from '../components/timepicker';
import Toggle from '../components/toggle';
import "./navbar_css/scheduling.css";


import { MdNotificationsNone } from "react-icons/md";
//import { MdNotificationsActive } from "react-icons/md";

function Scheduling() {
	const onPanelChange = (value, mode) => {
		console.log(value.format('YYYY-MM-DD'), mode);
	  };
	
	const timeSelect = (time, timeString) => {
		console.log(time, timeString);
	  };

	return(
		<>
	<Navbar />
	<div className="scheduling">
		<div className="dashboard-notification">
			<div className="small-profile-image">
				<img className="user-image"></img>
			</div>
			<div className="welcome-user">
			<p><b>Hello, user</b></p>
			<p>Displaying caregivers in 21121</p>
			</div>

			<div className="nofi-icon-container">
				<MdNotificationsNone className="nofi-icon" />
				{/* <MdNotificationsActive /> */}
			</div>
			
		</div>

		<div className="date-selection">
			<div>
			<h3>When do you need us?</h3>
			{/* <Calendar fullscreen={false} onPanelChange={onPanelChange} className='calendar'/> */}
			<Calendar />
			</div>

			

			<div className="repeat-schedule">
				<div>
				<p>Repeat your selecton weekly</p>
				</div>

				<div className='toggleOn-icon-container'>
				<Toggle />
				</div>
			
			
			</div>

			<div className="time-selection">
				<div>
				<p>Start Time</p>
				<TimePicker className='timePicker'/>
				
				</div>

				{/* <div>
				<p>End Time</p>
				<TimePicker className='timePicker'/>
			
				</div> */}
			</div>
			
		</div >


			<div className="button-container">
			<button className="big-button"><a href="/caregiver">Check available caregivers</a></button>
			</div>
	</div>
	
	</>
	)
	
}

export default Scheduling;

