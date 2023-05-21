import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import jwt_decode from 'jwt-decode';

import '../css/style.css';

const Navigation = () => {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch token from local storage and decode it
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);

      // If the token is still valid, get userId from local storage
      if (expirationDate > new Date()) {
        setUserId(localStorage.getItem('username'));
      } else {
        // If the token is expired, remove it from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
      }
    }
  }, []);

  const handleLogout = event => {
    event.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUserId(null);
    navigate('/');
  };

  return (
    <Navbar color="dark" expand="md">
      <NavbarBrand className="text-white" to="/" tag={RouterNavLink}>
        <img
          src="/images/logo_light.png"
          alt="Cat logo"
          style={{ height: '40px', marginRight: '10px' }}
        />
        Liam's Cat Blog
      </NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink className="text-white" to="/" exact tag={RouterNavLink}>
            Main
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="text-white" to="/images" tag={RouterNavLink}>
            Images
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="text-white" to="/family" tag={RouterNavLink}>
            Family
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className="text-white" to="/blog" tag={RouterNavLink}>
            Blog
          </NavLink>
        </NavItem>
        {userId ? (
          <>
            <NavItem>
              <NavLink
                className="text-white"
                to="/dashboard"
                tag={RouterNavLink}
              >
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-white" href="/" onClick={handleLogout}>
                Logout
              </NavLink>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <NavLink className="text-white" to="/login" tag={RouterNavLink}>
              Login
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
