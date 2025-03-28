import axios from 'axios';

const BASE_URL = 'https://reqres.in/api';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const fetchUsers = async (page = 1) => {
  try {
    const response = await api.get(`/users?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to fetch users');
  }
};

export const updateUser = async (id, userData) => {
  try {
    console.log('API Update Request:', { id, userData });
    const response = await api.put(`/users/${id}`, userData);
    
    console.log('API Update Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Update Error:', error.response || error);
    throw error.response ? error.response.data : new Error('Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete user');
  }
};