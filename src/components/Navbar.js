import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getRole, logout } from '../utils/Auth';

const Navbar = () => {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
      {!isAuthenticated() || role !== 'Buyer' ? <Link to="/">Home</Link> : null}
      </div>
      <div className="navbar-center">
        {/* Home will automatically be centered here */}
      </div>
      <div className="navbar-right">
        {isAuthenticated() ? (
          <>
            {role === 'Buyer' && <Link to="/orders">Browse Products</Link>}
            {role === 'Seller' && <Link to="/dashboard">Dashboard</Link>}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
