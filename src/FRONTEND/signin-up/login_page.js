import React, { useState } from "react";
import "./signin-up_css/login.css";
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaApple, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Logo from "../image/favicon.png";
import api from '../../api.js';
import axios from "axios";


function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "", 
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/client/login`, formData);
      alert(response.data.message); // Log response message
      navigate('/home')
    } catch (error) {
      console.error('Error:', error);
      alert(error.code + ' : ' + error.message);

    }
  };
  return (
    <>
      <div className="login">
        <div className="top_login">
          <h1 className="logo_name">
            <img className="logo" src={Logo} alt="Kindred Logo" />
            Kindred
          </h1>
          <p>Caring Connections, Compassionate Care</p>

          <div className="button_section">
            <button className="signin-button">Sign in</button>
            <button className="registration-button">
              <a href="/registration">Register</a>
            </button>
          </div>
        </div>

        <div className="bottom_login">
          <form className="login_form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email} 
                onChange={handleChange}
                required
                placeholder="Enter email"
              />
            </div>

            <div className="password-input">
              <label htmlFor="password">Password:</label>
              <div className="password-with-toggle">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>
            </div>

            <p className="forgot_password">
              <a href="#">Forgot password?</a>
            </p>

            <div className="signin-option">
              <button type="submit" id="signin-big-button" className="big-button">
                Sign In
              </button>

              <p>Other sign in option</p>

              <div className="social_media_icons">
                <FaFacebookF className="facebook-icon" />
                <FaGoogle className="google-icon" />
                <FaApple className="apple-icon" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
