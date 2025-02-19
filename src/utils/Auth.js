export const isAuthenticated = () => {
    return localStorage.getItem('token') ? true : false;
  };
  
  export const getRole = () => {
    return localStorage.getItem('role');
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };
  