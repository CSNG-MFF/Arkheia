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
  const parameterSearchInputRef = useRef(null);

  const [alertVisible, setAlertVisible] = useState(false);

  const handleParameterSearchUpload = async (event) => {
    
  };

  const handleFolderUpload = async (event) => {
    let parametersJsonData, simulation_run_name, model_name, creation_data, model_description;
    const stimuli = [];
    const expProtocols = [];
    const records = [];
    const results = [];
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

            if (movieFile) {
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
        else if (file.name === "experimental_protocols.json") {
          const jsonData = JSON.parse(contents);
          for (var exp_protocol of jsonData) {
            const code_name = exp_protocol.class;
            const short_description = exp_protocol.short_description;
            const long_description = exp_protocol.long_description;
            const parameters = exp_protocol.parameters;
            const whole_exp_protocol = { code_name, short_description, long_description, parameters };
            expProtocols.push(whole_exp_protocol);
          }
        }
        else if (file.name === "recorders.json") {
          const jsonData = JSON.parse(contents);
          for (var record of jsonData) {
            const code_name = record.code;
            const short_description = record.short_description;
            const long_description = record.long_description;
            const parameters = record.parameters;
            const variables = record.variables;
            const source = record.source;
            const whole_record = { code_name, short_description, long_description, parameters, variables, source };
            records.push(whole_record);
          }
        }
        else if (file.name === "results.json") {
          const jsonData = JSON.parse(contents);
          for (var result of jsonData) {
            const code_name = result.code;
            const name = result.name;
            const parameters = result.parameters;
            const caption = result.caption;
            const figure = result.figure;
            const figurePath = file.webkitRelativePath.replace(file.name, '') + figure;

            // Find the figure file in the files array
            const figureFile = Array.from(files).find(f => f.webkitRelativePath === figurePath);

            if (figureFile) {
              const figureReader = new FileReader();
              figureReader.onload = function(e) {
                const base64FigureData = e.target.result;
                const whole_result = { code_name, name, parameters, caption, figure: base64FigureData };
                results.push(whole_result);
              };
              figureReader.readAsDataURL(figureFile);
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
  const savedExpProtocols = [];
  const savedRecords = [];
  const savedResults = [];

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

  for (var expProtocol of expProtocols) {
    const response = await fetch('/exp_protocols', {
      method: 'POST',
      body: JSON.stringify(expProtocol),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    const json = await response.json()
    if (!response.ok) {
      console.error(json.error);
    }
    else {
      savedExpProtocols.push(json._id);
    }
  }

  for (var record of records) {
    const response = await fetch('/records', {
      method: 'POST',
      body: JSON.stringify(record),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    const json = await response.json()
    if (!response.ok) {
      console.error(json.error);
    }
    else {
      savedRecords.push(json._id);
    }
  }

  for (var result of results) {
    const response = await fetch('/results', {
      method: 'POST',
      body: JSON.stringify(result),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    const json = await response.json()
    if (!response.ok) {
      console.error(json.error);
    }
    else {
      savedResults.push(json._id);
    }
  }

  simulationWithParameters.stimuliIds = savedStimulus;
  simulationWithParameters.expProtocolIds = savedExpProtocols;
  simulationWithParameters.recordIds = savedRecords;
  simulationWithParameters.resultIds = savedResults;

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
            <ButtonGroup>
              <Button color='light'>
                <NavItem>
                  <NavLink style={{ whiteSpace: 'nowrap' }} href="/parameter_search">Parameter searches</NavLink>
                </NavItem>
              </Button>
              <Button color="light">
                <NavItem>
                  <NavLink style={{ whiteSpace: 'nowrap' }}>
                  <input
                    type="file"
                    webkitdirectory="true"
                    style={{ display: 'none' }}
                    ref={parameterSearchInputRef} 
                    onChange={handleParameterSearchUpload} 
                  />
                    <IoAddOutline size={30} style={{ cursor: 'pointer' }} onClick={() => {
                      parameterSearchInputRef.current.click();
                    }}/>
                  </NavLink>
                </NavItem>
              </Button>
            </ButtonGroup>
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