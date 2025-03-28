import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import EditUser from './components/EditUser';
import Navbar from './components/Navbar';
import { isAuthenticated } from './utils/auth';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? (
    <>
      <Navbar />
      {children}
    </>
  ) : (
    <Navigate to="/" />
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit/:id" 
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;