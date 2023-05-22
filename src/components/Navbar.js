import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse,
} from 'reactstrap';
import { UserContext } from '../context/UserContext'; // Import UserContext

import '../css/style.css';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const toggle = () => setIsOpen(!isOpen);

  const handleLogout = event => {
    event.preventDefault();
    logout();
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
      <NavbarToggler onClick={toggle} style={{ backgroundColor: 'white' }} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ms-auto" navbar>
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
          {user ? (
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
      </Collapse>
    </Navbar>
  );
};

export default Navigation;
