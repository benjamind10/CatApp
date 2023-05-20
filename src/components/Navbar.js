// components/Navbar.js
import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const Navigation = () => {
  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand to="/" tag={RouterNavLink}>
        Cat API
      </NavbarBrand>
      <Nav className="mr-auto" navbar>
        <NavItem>
          <NavLink to="/" exact tag={RouterNavLink}>
            Main
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/info" tag={RouterNavLink}>
            Info
          </NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Navigation;
