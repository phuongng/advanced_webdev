import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLocation  } from 'react-router-dom';
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


	const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

	const handleDateChange = date => {
		console.log(date);
        // 'date' is in the format 'YYYY-MM-DD'
		const [year, month, day] = date.split('-').map(num => parseInt(num, 10));
		// Create a new date object using local time zone
		const correctedDate = new Date(year, month - 1, day);
		setSelectedDate(correctedDate);
    };
    
    const handleStartTimeChange = time => {
        setStartTime(time);
    };
    
    const handleEndTimeChange = time => {
        setEndTime(time);
    };
    
    const formatSchedule = () => selectedDate && startTime && endTime ?
    `${new Date(selectedDate).toLocaleDateString()} from ${startTime} to ${endTime}` : 'No schedule selected';


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

    // Calculate total cost based on selected services
    useEffect(() => {
        const totalCost = bookingConfirmation.price_breakdown
            .filter(service => bookingConfirmation.service_required.includes(service.name))
            .reduce((total, service) => total + service.price, 0);
        setBookingConfirmation(prevState => ({
            ...prevState,
            total: totalCost
        }));
    }, [bookingConfirmation.service_required]);
    
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

		console.log('Current schedule:', bookingConfirmation.schedule);

		if (bookingConfirmation.schedule) {
			const [datePart, timePart] = bookingConfirmation.schedule.split(',');
			if (datePart && timePart) {
				const timeRange = timePart.trim().split('-')[0].trim(); // Get the start time part only

				// Combine date and start time to form a complete Date object
				const dateTime = new Date(`${datePart.trim()} ${timeRange}`);

				const appointmentData = {
					serviceNeeded: bookingConfirmation.service_required.reduce((acc, service) => ({ ...acc, [service]: true }), {}),
					dateTime: dateTime.toISOString(),
					clientID: "661399fff6281483dd3fc4a2",
					caregiverID: caregiverName,
					status: "Pending"
				};

				console.log('data:', appointmentData);
				api.post('appointment/new', appointmentData)
					.then(response => {
						console.log('Appointment created:', response.data);
					})
					.catch(error => {
						console.error('Failed to create appointment:', error);
					});
			}
		} else {
			console.error('No schedule set');
		}
    }

    const [editMode, setEditMode] = useState({
        service: false,
        schedule: false,
        price_breakdown: false
    });

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

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
		if (selectedDate && startTime && endTime) {
			const formattedDate = new Date(selectedDate).toLocaleDateString('en-US');
			const newSchedule = `${formattedDate}, ${startTime} - ${endTime}`;
	
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
		} else {
			alert('Please select a date, start time, and end time.');
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
                    <h3>Schedule with {caregiverName}</h3>
                    <h5>Just one last step!</h5>
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
								<div>
									<label>Date:</label>
									<input type="date" value={selectedDate} onChange={e => handleDateChange(e.target.value)} />
								</div>
								<div>
									<label>Start Time:</label>
									<input type="time" value={startTime} onChange={e => handleStartTimeChange(e.target.value)} />
								</div>
								<div>
									<label>End Time:</label>
									<input type="time" value={endTime} onChange={e => handleEndTimeChange(e.target.value)} />
								</div>
								<div>
									<h4>Scheduled Time:</h4>
									<p>{formatSchedule()}</p>
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

                <div className="button-container">
                    <button className="big-button" onClick={handleConfirmBooking}>
                    <Link to={`/confirmation?caregiverName=${caregiverName}`} className="big-button">
            Confirm Booking
        </Link>
                    </button>
                </div>
            </div>
        </>
    );
}

export default Booking;
