import { IoAddOutline } from "react-icons/io5";
import React, { useState, useRef } from 'react'
import {
    Button,
    Alert,
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

  const [alertVisible, setAlertVisible] = useState(false);
  const handleFolderUpload = async (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name === "info") {
        const reader = new FileReader();
        reader.onload = async function(e) {
          const contents = e.target.result;
          const simulation_run_name = contents.match(/'simulation_run_name': '([^']*)'/)[1];
          const model_name = contents.match(/'model_name': '([^']*)'/)[1];
          const creation_data_bad = contents.match(/'creation_data': '([^']*)'/)[1];
          
          const [datePart, timePart] = creation_data_bad.split("-");
          const [day, month, year] = datePart.split("/");
          const [hours, minutes, seconds] = timePart.split(":");
          const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
          const creation_data = date.toISOString();

          const simulation = {simulation_run_name, model_name, creation_data}
          console.log(simulation);

          const response = await fetch('/simulation_runs', {
            method: 'POST',
            body: JSON.stringify(simulation),
            headers: {
              'Content-Type' : 'application/json'
            }
          })

          const json = await response.json()
          if (!response.ok) {
            console.error(json.error);
          }

          if (response.ok) {
            console.log('new simulation added');
            setAlertVisible(true);  // Show the alert
            setTimeout(() => setAlertVisible(false), 3000);
            //window.location.reload();
            inputRef.current.value = "";
          }
        };
      reader.readAsText(file);
    }
  }
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
        <Alert style={{ paddingLeft: 20, paddingRight: 20 }} color="success" isOpen={alertVisible} toggle={() => setAlertVisible(false)}>
          Simulation added successfully!
        </Alert>
      </div>
    )
}

export default NavBar