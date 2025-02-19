import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';  // Import toast

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Buyer',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/signup', formData);
      toast.success('Signup successful! Please log in.');  // Replacing alert with toast
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message);  // Replacing alert with toast
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-image-container">
        <div className="image-overlay"></div>
      </div>
      <div className="signup-form-container">
        <h2 className="signup-title">Signup</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            id="username-input"
            className="signup-input"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            id="email-input"
            className="signup-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            id="password-input"
            className="signup-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select name="role" value={formData.role} onChange={handleChange} className="signup-select">
            <option value="Buyer">Buyer</option>
            <option value="Seller">Seller</option>
          </select>
          <button type="submit" className="signup-button">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
