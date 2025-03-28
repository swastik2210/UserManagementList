import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear the token
    navigate('/'); // Redirect to login page
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 20px',
      backgroundColor: '#f4f6f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
        User Management
      </div>
      <button 
        onClick={handleLogout}
        style={{
          padding: '10px 15px',
          background: 'linear-gradient(to right, #f44336, #ef5350)',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;