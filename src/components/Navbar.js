import React, { useContext } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { UserContext } from '../context/UserContext';

const Navigation = () => {
  const { userId, logout } = useContext(UserContext);

  const handleLogout = event => {
    event.preventDefault();
    logout();
  };

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand to="/" tag={RouterNavLink}>
        Liam's Cat Blog
      </NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink to="/" exact tag={RouterNavLink}>
            Main
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/images" tag={RouterNavLink}>
            Images
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/blog" tag={RouterNavLink}>
            Blog
          </NavLink>
        </NavItem>
        {userId ? (
          <>
            <NavItem>
              <NavLink to="/dashboard" tag={RouterNavLink}>
                Dashboard
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/" onClick={handleLogout}>
                Logout
              </NavLink>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <NavLink to="/login" tag={RouterNavLink}>
              Login
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default Navigation;
