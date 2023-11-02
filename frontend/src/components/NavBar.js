import { Link } from 'react-router-dom'
//reactstrap

import React from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
  } from 'reactstrap';


const NavBar = (args) => {
    return (
      <div>
        <Navbar {...args} className="flex-column">
          <NavbarBrand href="/">Arkheia</NavbarBrand>
          <Nav className="flex-column"navbar>
            <NavItem>
              <NavLink href="/simulations">Simulations</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/documentation">Documentation</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
}

export default NavBar