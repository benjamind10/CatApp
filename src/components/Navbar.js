import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Navigation = ({ isLoggedIn }) => {
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
        {isLoggedIn ? (
          <NavItem>
            <NavLink to="/dashboard" tag={RouterNavLink}>
              Dashboard
            </NavLink>
          </NavItem>
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
