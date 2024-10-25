import { IoAddOutline } from "react-icons/io5";
import React, { useState, useRef, useEffect } from 'react'

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
    ButtonGroup,
    Progress
  } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css'

/**
 * 
 * @returns The navbar of the page
 */
const NavBar = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const simulationInputRef = useRef(null);
  const parameterSearchInputRef = useRef(null);

  // Controls the visibility of data upload buttons based on database write access
  const [uploadsAllowed, setUploadsAllowed] = useState(false);
  useEffect(() => {
    fetch(`${apiUrl}/api/database-write-enabled`)
      .then(response => response.json())
      .then(data => setUploadsAllowed(data?.writeEnabled === true))
      .catch(error => console.error("Error fetching update status:", error));
  }, [apiUrl]);

  // Controls the visibility of the simulation upload alert
  const [simulationAlertVisible, setSimulationAlertVisible] = useState(false);

  // Controls the visibility of the parameter search upload alert
  const [parameterSearchAlertVisible, setParameterSearchAlertVisible] = useState(false);

  // Controls the upload progress of both simulations and parameter searches
  const [uploadProgress, setUploadProgress] = useState(0);

  // Controls if an upload is happening
  const [isUploadActive, setIsUploadActive] = useState(false);
  
  // The names of the files searched
  const information_file = "sim_info.json";
  const parameters_file = "parameters.json";
  const stimuli_file = "stimuli.json";
  const experimental_protocols_file = "experimental_protocols.json";
  const records_file = "recorders.json";
  const results_file = "results.json";

  const parameter_combinations_file = "parameter_combinations.json"

  // Checks if an upload is active, if yes, the user will be asked if they really want to leave the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isUploadActive) {
        event.preventDefault();
        event.returnValue = ''; 
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isUploadActive]);

  /**
   * 
   * @param event the folder of the parameter search 
   */
  const handleParameterSearchUpload = async (event) => {
    setIsUploadActive(true);
    const files = event.target.files;
    const folders = {};

    const parameter_search = {};
    setUploadProgress(1); // Set the progress bar to 1
    for (let i = 0; i < files.length; i++) { // Iterate trough all the files
      const file = files[i];
      const reader = new FileReader();
      const file_promise = new Promise((resolve, reject) => {
        reader.onload = async function(e) {
          const contents = e.target.result;
          if (file.name === information_file && !parameter_search.name) {
            const json_data = JSON.parse(contents);
            parameter_search.model_name = json_data.model_name;
            parameter_search.name = json_data.simulation_run_name;
            const [date_part, time_part] = json_data.run_date.split("-");
            const [day, month, year] = date_part.split("/");
            const [hours, minutes, seconds] = time_part.split(":");
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
            parameter_search.run_date = date.toISOString();
          }
          else if (file.name === parameter_combinations_file) {
            const json_data = JSON.parse(contents);
            let parameter_combinations = {};
            // Iterate trough all of the parameter combinations
            json_data.forEach(item => {
              for (let key in item) {
                if (!parameter_combinations[key]) {
                  parameter_combinations[key] = [];
                }
                if (!parameter_combinations[key].includes(item[key])) {
                  parameter_combinations[key].push(item[key]);
                }
              }
            });
            parameter_search.parameter_combinations = parameter_combinations;
          } 
          resolve();
        };
        reader.onerror = reject;
      });
      reader.readAsText(file);
      await file_promise;

      const file_path = file.webkitRelativePath;
      const path_parts = file_path.split('/');

      // If the file is in a subfolder, add the file to the folder's list
      if (path_parts.length > 2) {
        const folder_name = path_parts[1];
        if (!folders[folder_name]) {
          folders[folder_name] = [];
        }
        folders[folder_name].push(file);
      }
    }

    // The ids of the saved simulations
    let simulationIds = [];
    const total_files = Object.keys(folders).length;
    let processed_files = 0;

    // Call processFiles for each folder
    for (const folder_name in folders) {
      const folder_files = folders[folder_name];
      const result_simulation_id = await processFiles(folder_files, true);
      processed_files++;
      setUploadProgress((processed_files / total_files) * 100);
      simulationIds.push(result_simulation_id);
    }

    // If certain values of a parameter search are defined, we can save it to the database
    if (parameter_search.model_name && parameter_search.name && parameter_search.run_date) {
      const parameter_search_together = {
        model_name: parameter_search.model_name,
        name: parameter_search.name,
        run_date: parameter_search.run_date,
        simulationIds,
        parameter_combinations: parameter_search.parameter_combinations
      };
      const response = await fetch(`${apiUrl}/parameter_searches`, {
        method: 'POST',
        body: JSON.stringify(parameter_search_together),
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      setUploadProgress(100);
  
      const json = await response.json()
      if (!response.ok) {
        console.error(json.error);
      }
    
      if (response.ok) {
        setParameterSearchAlertVisible(true);  // Show the alert
        setTimeout(() => setParameterSearchAlertVisible(false), 3000); // Fade out the alert after 3 seconds
        setTimeout(() => window.location.reload(), 2000); // Reload the window after 2 seconds
        simulationInputRef.current.value = "";
      }
    }
    parameterSearchInputRef.current.value = "";
    setIsUploadActive(false);
  };

  /**
   * 
   * @param files The files that we want to save 
   * @param parameter_search_bool Controls if the simulation is a part of a parameter search
   * @returns 
   */
  const processFiles = async (files, parameter_search_bool) => {
    let processed_files = 0; // Count the number of processed files for the progress bar
    if (!parameter_search_bool) {
      setUploadProgress(1);
    }

    const simulation_data = {};

    const stimuli = [];
    const exp_protocols = [];
    const records = [];
    const results = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const file_promise = new Promise((resolve, reject) => { // Go trough all of the files inside the folder
        reader.onload = async function(e) {
          const contents = e.target.result;
          if (file.name === information_file) { // If we ecountered the information file
            const json_data = JSON.parse(contents);
  
            simulation_data.simulation_run_name = json_data.simulation_run_name;
            simulation_data.model_name = json_data.model_name;
            simulation_data.model_description = json_data.model_description;
            
            const unformatted_creation_data = json_data.run_date;
            const [datePart, timePart] = unformatted_creation_data.split("-");
            const [day, month, year] = datePart.split("/");
            const [hours, minutes, seconds] = timePart.split(":");
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

            simulation_data.creation_data = date.toISOString();
          }
          else if (file.name === parameters_file) { // If we encountered the parameters
            simulation_data.parameters = JSON.parse(contents);
          }
          else if (file.name === stimuli_file) { // If we we encountered the stimuli file
            const json_data = JSON.parse(contents);
            for (var stimulus of json_data) {
              const code_name = stimulus.code;
              const short_description = stimulus.short_description;
              const long_description = stimulus.long_description;
              const parameters = stimulus.parameters;
              const movie = stimulus.movie;
              const movie_file_path = file.webkitRelativePath.replace(file.name, '') + movie;
              const stimulus_data = new FormData();
              stimulus_data.append("code_name", code_name);
              stimulus_data.append("short_description", short_description);
              stimulus_data.append("long_description", long_description);
              stimulus_data.append("parameters", JSON.stringify(parameters));
              
              // Find the movie file in the files array
              const movie_file = Array.from(files).find(f => f.webkitRelativePath === movie_file_path);

              if (movie_file) {
                stimulus_data.append("movie", movie_file);
                stimuli.push(stimulus_data);
              }
            }
          }
          else if (file.name === experimental_protocols_file) { // If we ecnountered the experimental protocols file
            const json_data = JSON.parse(contents);
            for (var exp_protocol of json_data) {
              const code_name = exp_protocol.class;
              const short_description = exp_protocol.short_description;
              const long_description = exp_protocol.long_description;
              const parameters = exp_protocol.parameters;
              const whole_exp_protocol = { code_name, short_description, long_description, parameters };
              exp_protocols.push(whole_exp_protocol);
            }
          }
          else if (file.name === records_file) { // If we encountered the records file
            const json_data = JSON.parse(contents);
            for (var record of json_data) {
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
          else if (file.name === results_file) {
            const json_data = JSON.parse(contents);
            for (var result of json_data) {
              const code_name = result.code;
              const name = result.name;
              const parameters = result.parameters;
              const caption = result.caption;
              const figure = result.figure;
              const figure_path = file.webkitRelativePath.replace(file.name, '') + figure;
              const result_data = new FormData();
              result_data.append("code_name", code_name);
              result_data.append("name", name);
              result_data.append("parameters", JSON.stringify(parameters));
              result_data.append("caption", caption);

              // Find the figure file in the files array
              const figure_file = Array.from(files).find(f => f.webkitRelativePath === figure_path);
              if (figure_file) {
                result_data.append("figure", figure_file);
                results.push(result_data);
              }
            }
          }
          resolve();
        };
        reader.onerror = reject;
      });
  
      reader.readAsText(file);
      await file_promise;
    }
  
    // Add together the simulation
    const simulation_together = { 
      simulation_run_name: simulation_data.simulation_run_name, 
      model_name: simulation_data.model_name, 
      creation_data: simulation_data.creation_data, 
      model_description: simulation_data.model_description, 
      parameters: simulation_data.parameters 
    };
    
    // The IDs of the saved components
    const saved_stimuli = [];
    const saved_experimental_protocols = [];
    const saved_records = [];
    const saved_results = [];

    // Helper variable for the progress bar
    const total_files = stimuli.length + exp_protocols.length + records.length + results.length;

    // Iterate trough all of the stimuli and save them
    for (var stimulus of stimuli) {
      if (!parameter_search_bool) {
        processed_files++;
        setUploadProgress((processed_files / total_files) * 100);
      }
      const response = await fetch(`${apiUrl}/stimuli`, {
        method: 'POST',
        body: stimulus
      })
      const json = await response.json()
      if (!response.ok) {
        console.error(json.error);
      }
      else {
        saved_stimuli.push(json._id);
      }
    }

    // Iterate trough all of the experimental protocols and save them
    for (var experimental_protocol of exp_protocols) {
      if (!parameter_search_bool) {
        processed_files++;
        setUploadProgress((processed_files / total_files) * 100);
      }
      const response = await fetch(`${apiUrl}/exp_protocols`, {
        method: 'POST',
        body: JSON.stringify(experimental_protocol),
        headers: {
          'Content-Type' : 'application/json'
        }
      })
      const json = await response.json()
      if (!response.ok) {
        console.error(json.error);
      }
      else {
        saved_experimental_protocols.push(json._id);
      }
    }
  
    // Iterate trough all of the records and save them
    for (var record of records) {
      if (!parameter_search_bool) {
        processed_files++;
        setUploadProgress((processed_files / total_files) * 100);
      }
      const response = await fetch(`${apiUrl}/records`, {
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
        saved_records.push(json._id);
      }
    }

    // Iterate trough all of the results and save them
    for (var result of results) {
      if (!parameter_search_bool) {
        processed_files++;
        setUploadProgress((processed_files / total_files) * 100);
      }
      const response = await fetch(`${apiUrl}/results`, {
        method: 'POST',
        body: result
      })
      const json = await response.json()
      if (!response.ok) {
        console.error(json.error);
      }
      else {
        saved_results.push(json._id);
      }
    }
  
    // Add the ids of the saved components to the simulation
    simulation_together.stimuliIds = saved_stimuli;
    simulation_together.expProtocolIds = saved_experimental_protocols;
    simulation_together.recordIds = saved_records;
    simulation_together.resultIds = saved_results;
    simulation_together.from_parameter_search = parameter_search_bool;
  
    
    // Save the data to the database
    const response = await fetch(`${apiUrl}/simulation_runs`, {
      method: 'POST',
      body: JSON.stringify(simulation_together),
      headers: {
        'Content-Type' : 'application/json'
      }
    })

    if (!parameter_search_bool) {
      setUploadProgress(100);
    }
    const json = await response.json()
    if (!response.ok) {
      console.error(json.error);
    }
  
    if (response.ok) {
      if (!parameter_search_bool) {
        setSimulationAlertVisible(true);  // Show the alert
        setTimeout(() => setSimulationAlertVisible(false), 3000);
        setTimeout(() => window.location.reload(), 2000);
        simulationInputRef.current.value = "";
      }
    }
    return json._id;
  };

  // Handles a folder upload
  const handleFolderUpload = async (event) => {
    setIsUploadActive(true); // Start tracking upload state
    const files = event.target.files;

    try {
      await processFiles(files, false);
    } finally {
      setIsUploadActive(false); // Update upload state
    }
  };

  const [documentationDropDownOpen, setDocumentationDropDownOpen] = useState(false);

  const toggleDocumentationDropDown = () => setDocumentationDropDownOpen(!documentationDropDownOpen);

    return (
      <div style={{
        paddingTop: 5
      }} className="Navbar">
        {uploadProgress > 0 && <Progress value={uploadProgress} />}
        <Navbar style={{paddingRight: 20}} color='light' light expand="md">
          <NavbarBrand style={{paddingLeft: 20}} href="/">Arkheia</NavbarBrand>
          <Nav className="mr-auto" pills justified navbar>  
            <ButtonGroup>
              <Button color='light'>
                <NavItem>
                  <NavLink style={{ whiteSpace: 'nowrap' }} href="/simulation_runs">Simulation runs</NavLink>
                </NavItem>
              </Button>
              <Button color="light" disabled={!uploadsAllowed}>
                <NavItem>
                  <NavLink style={{ whiteSpace: 'nowrap' }}>
                  <input
                    type="file"
                    webkitdirectory="true"
                    style={{ display: 'none' }}
                    ref={simulationInputRef} 
                    onChange={handleFolderUpload} 
                  />
                    <IoAddOutline size={30} style={{ cursor: 'pointer' }} onClick={() => {
                      simulationInputRef.current.click();
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
              <Button color="light" disabled={!uploadsAllowed}>
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
        <Alert style={{ paddingLeft: 20, paddingRight: 20 }} color="success" isOpen={simulationAlertVisible} toggle={() => setSimulationAlertVisible(false)}>
          Simulation added successfully!
        </Alert>
        <Alert style={{ paddingLeft: 20, paddingRight: 20 }} color="success" isOpen={parameterSearchAlertVisible} toggle={() => setParameterSearchAlertVisible(false)}>
          Parameter search added successfully!
        </Alert>
      </div>
    )
}

export default NavBar