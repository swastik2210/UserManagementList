import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser } from '../services/api';

// Reusable Popup Component
const ConfirmationPopup = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  message 
}) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Confirm Deletion</h3>
        <p>{message}</p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '20px' 
        }}>
          <button 
            onClick={onConfirm} 
            style={{ 
              background: 'linear-gradient(to right, #f44336, #ef5350)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Confirm
          </button>
          <button 
            onClick={onCancel}
            style={{ 
              background: 'linear-gradient(to right, #4CAF50, #81c784)',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    userId: null
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers(page);
        
        setUsers(data.data);
        setTotalPages(data.total_pages);
        setLoading(false);
      } catch (err) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
        setLoading(false);
      }
    };

    loadUsers();
  }, [page]);

  const initiateDeleteUser = (userId) => {
    setDeleteConfirmation({
      isOpen: true,
      userId: userId
    });
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmation.userId) return;

    try {
      await deleteUser(deleteConfirmation.userId);
      setUsers(users.filter(user => user.id !== deleteConfirmation.userId));
      
      // Close the confirmation popup
      setDeleteConfirmation({
        isOpen: false,
        userId: null
      });
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete user');
      
      // Close the confirmation popup
      setDeleteConfirmation({
        isOpen: false,
        userId: null
      });
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/edit/${userId}`);
  };

  const cancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      userId: null
    });
  };

  if (loading) return <div style={{textAlign: 'center', padding: '20px'}}>Loading...</div>;
  if (error) return <div style={{color: 'red', textAlign: 'center'}}>{error}</div>;

  return (
    <div className="user-list-container">
      <h2>User Management</h2>
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} />
            <h3>{`${user.first_name} ${user.last_name}`}</h3>
            <p>{user.email}</p>
            <div className="user-actions">
              <button onClick={() => handleEditUser(user.id)}>Edit</button>
              <button onClick={() => initiateDeleteUser(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {page > 1 && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}
        {page < totalPages && (
          <button onClick={() => setPage(page + 1)}>Next</button>
        )}
      </div>

      <ConfirmationPopup
        isOpen={deleteConfirmation.isOpen}
        onConfirm={handleDeleteUser}
        onCancel={cancelDelete}
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserList;