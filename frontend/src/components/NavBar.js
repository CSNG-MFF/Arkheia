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
    UncontrolledDropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Button,
    Dropdown
  } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css'
const NavBar = (args) => {
    const [documentationDropDownOpen, setDocumentationDropDownOpen] = useState(false);

    const toggleDocumentationDropDown = () => setDocumentationDropDownOpen(!documentationDropDownOpen);

    return (
      <div style={{
        padding: 30,
        paddingRight: 50
      }}>
        <Navbar color='light' light expand="md">
          <NavbarBrand href="/">Arkheia</NavbarBrand>
          <Nav className="mr-auto" pills justified style={{ paddingRight: '' }} navbar>
            <NavItem>
              <NavLink href="/simulations">Simulations</NavLink>
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