import React, { createContext, useState } from 'react';

export const UserContext = createContext({
  userId: null,
  setUserId: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem('userId') || null);

  const logout = async () => {
    // Call to server logout endpoint
    await fetch('/user/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // This will include the httpOnly cookie in the request
    });

    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, logout }}>
      {children}
    </UserContext.Provider>
  );
};
