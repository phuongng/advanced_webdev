import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// Import pages
import Caregiver from '../src/FRONTEND/navbar/caregiver_page';
import Home from './FRONTEND/navbar/home_page';
import Registration from '../src/FRONTEND/signin-up/registration_page';
import Login from "../src/FRONTEND/signin-up/login_page";
import Message from '../src/FRONTEND/navbar/message_page';
import Scheduling from '../src/FRONTEND/navbar/scheduling_page';
import User_dashboard from './FRONTEND/navbar/user-dashboard_page';
import MessageHistoryPage from './FRONTEND/navbar/message-history';
// Import navbar
import Navbar from '../src/FRONTEND/components/navbar';

// Import subpage
import Booking from '../src/FRONTEND/subpage/booking_page';
import CaregiverProfile from '../src/FRONTEND/subpage/caregiverProfile_page';
import Confirmation from '../src/FRONTEND/subpage/confirmation_page';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/home" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/caregiver" element={<Caregiver />} />
          <Route path="/message" element={<Message />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/user-dashboard" element={<User_dashboard/>} />
          <Route path="/message-history" element={<MessageHistoryPage />} />


          <Route path="/navbar" element={<Navbar />} />
          
          {/* Subpage routes */}
          <Route path="/booking" element={<Booking />} />
          <Route path="/caregiver-profile/:fullname" element={<CaregiverProfile />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
