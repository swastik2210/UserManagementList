export const setToken = (token) => {
    localStorage.setItem('userToken', token);
  };
  
  export const getToken = () => {
    return localStorage.getItem('userToken');
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  // New logout function
  export const logout = () => {
    localStorage.removeItem('userToken');
  };