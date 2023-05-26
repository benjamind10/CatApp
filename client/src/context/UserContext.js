import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const setUserFromToken = token => {
    const decodedToken = jwt_decode(token);
    localStorage.setItem('userId', decodedToken.userId);
    localStorage.setItem('username', decodedToken.username);
    const user = {
      _id: decodedToken.userId,
      username: decodedToken.username,
    };
    setUser(user);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setUserFromToken(token);
    }
  }, []);

  const login = token => {
    localStorage.setItem('token', token);
    setUserFromToken(token);
  };

  const logout = async () => {
    // Call to server logout endpoint
    await fetch('/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This will include the httpOnly cookie in the request
    });
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
