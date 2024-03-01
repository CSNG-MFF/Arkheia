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
    let parametersJsonData, simulation_run_name, model_name, creation_data, model_description;
    const stimuli = [];
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const filePromise = new Promise((resolve, reject) => {
      reader.onload = async function(e) {
        const contents = e.target.result;
          if (file.name === "sim_info.json") {
            const jsonData = JSON.parse(contents);

            simulation_run_name = jsonData.simulation_run_name;
            model_name = jsonData.model_name;
            const unformatted_creation_data = jsonData.run_date;
            model_description = jsonData.model_description;

            const [datePart, timePart] = unformatted_creation_data.split("-");
            const [day, month, year] = datePart.split("/");
            const [hours, minutes, seconds] = timePart.split(":");
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
            creation_data = date.toISOString();
          }
          else if (file.name === "parameters.json") {
            parametersJsonData = JSON.parse(contents);
          }
          else if (file.name === "stimuli.json") {
            const jsonData = JSON.parse(contents);
            for (var stimulus of jsonData) {
              const code_name = stimulus.code;
              const short_description = stimulus.short_description;
              const long_description = stimulus.long_description;
              const parameters = stimulus.parameters;
              const movie = stimulus.movie;
              const movieFilePath = file.webkitRelativePath.replace(file.name, '') + movie;

              // Find the movie file in the files array
              const movieFile = Array.from(files).find(f => f.webkitRelativePath === movieFilePath);

              console.log(movieFile);
              if (movieFile) {
                console.log(movieFile);
                const movieReader = new FileReader();
                movieReader.onload = function(e) {
                  const base64MovieData = e.target.result;
                  const whole_stimuli = { code_name, short_description, long_description, parameters, movie: base64MovieData };
                  stimuli.push(whole_stimuli);
                };
                movieReader.readAsDataURL(movieFile);
              }
            }
          }
          resolve();
        };
        reader.onerror = reject;
      });

      reader.readAsText(file);
      await filePromise;
    }


    const simulationWithParameters = { simulation_run_name, model_name, creation_data, model_description, parameters: parametersJsonData };

    const savedStimulus = [];

    for (var stimulus of stimuli) {
      const response = await fetch('/stimuli', {
        method: 'POST',
        body: JSON.stringify(stimulus),
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      const json = await response.json()
      if (!response.ok) {
        console.error(json.error);
      }
      else {
        savedStimulus.push(json._id);
      }
    }

    simulationWithParameters.stimuliIds = savedStimulus;
    console.log(simulationWithParameters);
    const response = await fetch('/simulation_runs', {
      method: 'POST',
      body: JSON.stringify(simulationWithParameters),
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
      setTimeout(() => window.location.reload(), 2000);
      inputRef.current.value = "";
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