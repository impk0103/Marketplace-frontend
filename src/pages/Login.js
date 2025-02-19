import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';  // Import toast

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      toast.success('Login successful!');
  
      // Redirect based on role
      if (response.data.role === 'Buyer') {
        navigate('/orders');  // Redirect Buyer to Orders Page
      } else if (response.data.role === 'Seller') {
        navigate('/dashboard');  // Redirect Seller to Dashboard
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email-input"
            className="login-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            id="password-input"
            className="login-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
      <div className="login-image-container">
        <div className="image-overlay"></div>
      </div>
    </div>
  );
};

export default Login;
