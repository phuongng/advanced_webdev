import React, { useState } from "react";
import { useLocation } from 'react-router-dom';
import "../subpage/subpage_css/booking.css";
import Navbar from "../components/navbar";
import Calendar from "../components/calendar";
import TimePicker from '../components/timepicker';
import axios from 'axios';

function handleConfirmBooking() {
    const caregiverId = 'theCaregiverId';

    axios.post(`/api/caregiver/increment-patients/${caregiverId}`)
         .then(response => {
             console.log('Patient count incremented:', response.data);
             //TODO: Handle further actions after successful booking confirmation
         })
         .catch(error => {
             console.error('Failed to increment patient count:', error);
         });
}

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
        setShowCalendar(false);
        setEditMode({
            ...editMode,
            schedule: false,
            service: false,
            price_breakdown: false
        });

        // Calculate total price from the breakdown
        const totalPrice = bookingConfirmation.price_breakdown.reduce((acc, service) => {
            if (bookingConfirmation.service_required.includes(service.name)) {
                return acc + service.price;
            }
            return acc;
        }, 0);

        // Format the selected day and time
        const formattedDay = selectedDay ? selectedDay.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
        const formattedTime = startTime && endTime ? `${startTime} - ${endTime}` : '';

        // Update schedule in bookingConfirmation
        setBookingConfirmation({
            ...bookingConfirmation,
            total: totalPrice,
            schedule: `${formattedDay}, ${formattedTime}`
        });
    };

    const handleCalendarChange = (selectedDate) => {
        setSelectedDay(selectedDate);
    };

    const handleTimeChange = (time, type) => {
        if (type === "start") {
            setStartTime(time);
        } else {
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

							<div className="time-selection">
								<div>
									<p>Start Time</p>
									<TimePicker className='timePicker' onChange={(time) => handleTimeChange(time, "start")} />
								</div>

								<div>
									<p>End Time</p>
									<TimePicker className='timePicker' onChange={(time) => handleTimeChange(time, "end")} />
								</div>
							</div>
							
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
					Confirm Booking
				</button>
			</div>
		</div>
	</>
	
    );
}

export default Booking;
