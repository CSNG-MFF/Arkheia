import { IoAddOutline } from "react-icons/io5";
import React, { useState, useRef }from 'react'
import {
    Button,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Dropdown,
    ButtonGroup
  } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css'
const NavBar = () => {
    const inputRef = useRef(null);

    const handleFolderUpload = (event) => {
      const files = event.target.files;
    };
    const [documentationDropDownOpen, setDocumentationDropDownOpen] = useState(false);

    const toggleDocumentationDropDown = () => setDocumentationDropDownOpen(!documentationDropDownOpen);

    return (
      <div style={{
        paddingTop: 5
      }} className="Navbar">
        <Navbar style={{paddingRight: 20}} color='light' light expand="md">
          <NavbarBrand style={{paddingLeft: 20}} href="/">Arkheia</NavbarBrand>
          <Nav className="mr-auto" pills justified navbar>  
            <ButtonGroup>
              <Button color='light'>
                <NavItem>
                  <NavLink style={{ whiteSpace: 'nowrap' }} href="/simulation_runs">Simulation runs</NavLink>
                </NavItem>
              </Button>
              <Button color="light">
                <NavItem>
                  <NavLink style={{ whiteSpace: 'nowrap' }}>
                  <input
                    type="file"
                    webkitdirectory="true"
                    style={{ display: 'none' }}
                    ref={inputRef} 
                    onChange={handleFolderUpload} 
                  />
                    <IoAddOutline size={30} style={{ cursor: 'pointer' }} onClick={() => {
                      inputRef.current.click();
                    }}/>
                  </NavLink>
                </NavItem>
              </Button>
            </ButtonGroup>
            <Button color='light'>
              <NavItem>
                <NavLink style={{ whiteSpace: 'nowrap' }} href="/parameter_search">Parameter searches</NavLink>
              </NavItem>
            </Button>
            <Button color='light'>
              <NavItem>
                <NavLink href="/about">About</NavLink>
              </NavItem>
            </Button>
            <Dropdown group isOpen={documentationDropDownOpen} toggle={toggleDocumentationDropDown}>
              <Button color='light'>
                <NavItem>
                  <NavLink href="/documentation">Documentation</NavLink>
                </NavItem>
              </Button>
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