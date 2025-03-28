import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsers, updateUser } from '../services/api';

// Success Popup Component
const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Success</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const EditUser = () => {
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [originalUser, setOriginalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUsers();
        const foundUser = userData.data.find(u => u.id === parseInt(id));
        
        if (foundUser) {
          const userDetails = {
            first_name: foundUser.first_name,
            last_name: foundUser.last_name,
            email: foundUser.email || `${foundUser.first_name.toLowerCase()}.${foundUser.last_name.toLowerCase()}@example.com`
          };
          
          setUser(userDetails);
          setOriginalUser(userDetails);
          setLoading(false);
        } else {
          setError('User not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        setError('Failed to load user');
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, user);
      
      // Show success popup instead of alert
      setShowSuccessPopup(true);
    } catch (err) {
      console.error('Complete update error:', err);
      setError('Failed to update user');
      alert(`Update failed: ${err.message}`);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessPopup(false);
    navigate('/users');
  };

  const isModified = () => {
    return JSON.stringify(user) !== JSON.stringify(originalUser);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-user-container">
      {showSuccessPopup && (
        <SuccessPopup 
          message="User updated successfully!" 
          onClose={handleSuccessClose} 
        />
      )}
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={!isModified()}
          >
            Update User
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/users')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;