import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import "../subpage/subpage_css/booking.css";
import Navbar from "../components/navbar";
import Calendar from "../components/calendar";
import TimePicker from '../components/timepicker';
import api from '../../api.js';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Booking() {
    const query = useQuery();
    const caregiverName = query.get('caregiverName');
	console.log("Received caregiver name:", caregiverName);

    const [bookingConfirmation, setBookingConfirmation] = useState({
        service_required: [],
        schedule: "",
        total: 0,
        price_breakdown: [
            { name: "Personal Care Assistance", price: 100 },
            { name: "Mobility Aid", price: 50 },
            { name: "Errands", price: 75 },
            { name: "Medication Management", price: 120 },
            { name: "Catheter Care", price: 90 },
            { name: "Emotional Support", price: 80 }
        ]
    });

	const handleConfirmBooking = () => {
		// Define all possible services and initialize them to false
		const servicesRequired = {
			"Personal Care Assistance": false,
			"Mobility Aid": false,
			"Errands": false,
			"Medication Management": false,
			"Catheter Care": false,
			"Emotional Support": false
		};
	
		// Update the required services to true based on user selection
		bookingConfirmation.service_required.forEach(service => {
			if (servicesRequired.hasOwnProperty(service)) {
				servicesRequired[service] = true;
			}
		});
	
		// Parse the schedule to extract date and time
		const [datePart, timePart] = bookingConfirmation.schedule.split(',');
		const timeRange = timePart.split('-')[0].trim(); // Get the start time part only
	
		// Combine date and start time to form a complete Date object
		const dateTime = new Date(`${datePart.trim()} ${timeRange}`);
	
		const appointmentData = {
			serviceNeeded: servicesRequired,
			dateTime: dateTime.toISOString(),
			clientID: "ClientID", 
			caregiverID: caregiverName, 
			status: "Pending"
		};
	
		api.post('appointment/new', appointmentData)
			.then(response => {
				console.log('Appointment created:', response.data);
			})
			.catch(error => {
				console.error('Failed to create appointment:', error);
			});
	}
	
    const [editMode, setEditMode] = useState({
        service: false,
        schedule: false,
        price_breakdown: false
    });

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const toggleEditMode = (field) => {
        setEditMode({
            ...editMode,
            [field]: !editMode[field]
        });
        if (field === "schedule") {
            setShowCalendar(!showCalendar);
        }
    };

    const handleSave = () => {
		// Get today's date in the required format immediately
		const today = new Date();
		const defaultStartTime = "19:30";
		const defaultEndTime = "20:00";
	
		// Format today's date for the calendar if not selected
		const formattedDay = selectedDay ? selectedDay.toLocaleDateString('en-US', {
			weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
		}) : today.toLocaleDateString('en-US', {
			weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
		});
	
		// Use default times if none are selected
		const formattedTime = startTime && endTime ? `${startTime} - ${endTime}` :
							  `${defaultStartTime} - ${defaultEndTime}`;
	
		const newSchedule = `${formattedDay}, ${formattedTime}`;
	
		// Update schedule in bookingConfirmation with either selected or default values
		setBookingConfirmation(prevState => ({
			...prevState,
			schedule: newSchedule
		}));
	
		// Hide calendar and reset edit mode states
		setShowCalendar(false);
		setEditMode(prevState => ({
			...prevState,
			schedule: false,
			service: false,
			price_breakdown: false
		}));
	};
	
	

    const handleCalendarChange = (date) => {
		console.log(date);
		setSelectedDay(date);
	};

    const handleTimeChange = (time, type) => {
		if (type === "start") {
			setStartTime(time);
		} else if (type === "end") {
			setEndTime(time);
		}
	};

    const handleClick = (service) => {
        const newServiceRequired = [...bookingConfirmation.service_required];
        const index = newServiceRequired.indexOf(service);
        if (index === -1) {
            newServiceRequired.push(service);
        } else {
            newServiceRequired.splice(index, 1);
        }
        setBookingConfirmation({
            ...bookingConfirmation,
            service_required: newServiceRequired
        });
    };

    return (
		<>
		<Navbar />
		<div className="booking">
			<div className="booking-title">
				<h1>Schedule with {caregiverName}</h1>
				<h3>Just one last step!</h3>
				<p>Review your care plan summary before confirming.</p>
			</div>
	
			<div className="confirmation-schedule">
				<p>
					<b>Services Required:</b>{" "}
					{editMode.service ? (
						<div className="service-list">
							<p className={bookingConfirmation.service_required.includes('Personal Care Assistance') ? 'active' : ''} onClick={() => handleClick('Personal Care Assistance')}>Personal Care Assistance</p>
							<p className={bookingConfirmation.service_required.includes('Mobility Aid') ? 'active' : ''} onClick={() => handleClick('Mobility Aid')}>Mobility Aid</p>
							<p className={bookingConfirmation.service_required.includes('Errands') ? 'active' : ''} onClick={() => handleClick('Errands')}>Errands</p>
							<p className={bookingConfirmation.service_required.includes('Medication Management') ? 'active' : ''} onClick={() => handleClick('Medication Management')}>Medication Management</p>
							<p className={bookingConfirmation.service_required.includes('Catheter Care') ? 'active' : ''} onClick={() => handleClick('Catheter Care')}>Catheter Care</p>
							<p className={bookingConfirmation.service_required.includes('Emotional Support') ? 'active' : ''} onClick={() => handleClick('Emotional Support')}>Emotional Support</p>

							<button className="save-button" onClick={handleSave}>Save</button>
						</div>
					) : (
						<>
							{bookingConfirmation.service_required.join(', ')}
							<button className="edit-button" onClick={() => toggleEditMode("service")}>
								Edit
							</button>
						</>
					)}
				</p>
				<hr className="horizontal-line"></hr>
				<p>
					<b>Schedule:</b>
					{editMode.schedule ? (
						<>
							<Calendar onChange={handleCalendarChange} />
							<TimePicker label="Start Time" onChange={time => handleTimeChange(time, "start")} />
							<TimePicker label="End Time" onChange={time => handleTimeChange(time, "end")} />

							
							<button className="save-button" onClick={handleSave}>Save</button>
						</>
					) : (
						<>
							{bookingConfirmation.schedule}
							<button className="edit-button" onClick={() => toggleEditMode("schedule")}>
								Edit
							</button>
						</>
					)}
				</p>
				<hr className="horizontal-line"></hr>
				<p>
					<b>Total (USD):</b> $ {bookingConfirmation.total}
				</p>
				<p>
					<button className="price-button" onClick={() => toggleEditMode("price_breakdown")}>
						<b>Price Breakdown:</b>
					</button>
					{editMode.price_breakdown && (
						<div>
							{bookingConfirmation.price_breakdown
								.filter(service => bookingConfirmation.service_required.includes(service.name))
								.map((service, index) => (
									<p key={index}>{service.name}: ${service.price}</p>
								))}
						</div>
					)}
				</p>
			</div>
	
			<div className="confirmation-email">
				<label>Enter your email to receive a confirmation copy</label>
				<input type="email" name="email" required></input>
				<br />
			</div>
	
			<div>
				<button className="big-button" onClick={handleConfirmBooking}>
					<a href="/confirmation">Confirm Booking</a>
				</button>
			</div>
		</div>
	</>
	
    );
}

export default Booking;
