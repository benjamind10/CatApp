import React, { useEffect, useState } from 'react';

const UserContext = React.createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);

    if (token) {
      // replace this with the actual user data
      const user = { _id: '123', username: 'John Doe' };
      setUser(user);
    }
  }, []);

  const login = token => {
    localStorage.setItem('token', token);
    // replace this with the actual user data
    const user = { id: '123', name: 'John Doe' };
    setUser(user);
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
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
