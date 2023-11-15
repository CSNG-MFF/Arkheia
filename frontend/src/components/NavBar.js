//icons
//TODO npm install react-icons --save
//for now I don't have stable internet

//reactstrap
import React, { useState } from 'react'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown
  } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css'
const NavBar = () => {
    const [documentationDropDownOpen, setDocumentationDropDownOpen] = useState(false);

    const toggleDocumentationDropDown = () => setDocumentationDropDownOpen(!documentationDropDownOpen);

    return (
      <div style={{
        paddingTop: 30
      }} className="Navbar">
        <Navbar color='light' light expand="md">
          <NavbarBrand style={{paddingLeft: 20}} href="/">Arkheia</NavbarBrand>
          <Nav className="mr-auto" pills justified navbar>
            <NavItem>
              <NavLink href="/simulation_runs">Simulation runs</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/parameter_search">Parameter searches</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/about">About</NavLink>
            </NavItem>
            <Dropdown group isOpen={documentationDropDownOpen} toggle={toggleDocumentationDropDown}>
              <NavItem>
                <NavLink href="/documentation">Documentation</NavLink>
              </NavItem>
              <DropdownToggle caret color='light'/>
              <DropdownMenu>
                <DropdownItem> 
                  <NavItem>
                    <NavLink href="/documentation/client">Client</NavLink>
                  </NavItem> 
                </DropdownItem>
                <DropdownItem>
                  <NavItem>
                    <NavLink href="/documentation/api">API</NavLink>
                  </NavItem> 
                </DropdownItem>
                <DropdownItem>
                  <NavItem>
                    <NavLink href="/documentation/installation">Installation</NavLink>
                  </NavItem> 
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Nav>
        </Navbar>
      </div>
    )
}

export default NavBar