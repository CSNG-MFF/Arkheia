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

const NavBar = () => {
  const inputRef = useRef(null);
  const parameterSearchInputRef = useRef(null);

  const [alertVisible, setAlertVisible] = useState(false);
  const [parameterSearchAlertVisible, setParameterSearchAlertVisible] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadActive, setIsUploadActive] = useState(false);
  

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

  const handleParameterSearchUpload = async (event) => {
    setIsUploadActive(true);
    const files = event.target.files;
    const folders = {};

    let model_name = "";
    let run_date = "";
    let name = "";
    let parameter_combinations = {};
    setUploadProgress(1);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const filePromise = new Promise((resolve, reject) => {
        reader.onload = async function(e) {
          const contents = e.target.result;
          if (file.name === "sim_info.json" && (model_name == "" || run_date == "" || name == "")) {
            const jsonData = JSON.parse(contents);
            model_name = jsonData.model_name;
            name = jsonData.simulation_run_name;
            const [datePart, timePart] = jsonData.run_date.split("-");
            const [day, month, year] = datePart.split("/");
            const [hours, minutes, seconds] = timePart.split(":");
            const date = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));
            run_date = date.toISOString();
          }
          else if (file.name == "parameter_combinations.json") {
            const jsonData = JSON.parse(contents);
            jsonData.forEach(item => {
              for (let key in item) {
                if (!parameter_combinations[key]) {
                  parameter_combinations[key] = [];
                }
                if (!parameter_combinations[key].includes(item[key])) {
                  parameter_combinations[key].push(item[key]);
                }
              }
            });
          } 
          resolve();
        };
        reader.onerror = reject;
      });
      reader.readAsText(file);
      await filePromise;

      const filePath = file.webkitRelativePath;
      const pathParts = filePath.split('/');

      // If the file is in a subfolder, add the file to the folder's list
      if (pathParts.length > 2) {
        const folderName = pathParts[1];
        if (!folders[folderName]) {
          folders[folderName] = [];
        }
        folders[folderName].push(file);
      }
    }

    let simulationIds = [];
    const totalFiles = Object.keys(folders).length;
    let processedFiles = 0;
    // Call processFiles for each folder
    for (const folderName in folders) {
      const folderFiles = folders[folderName];
      const result_simulation_id = await processFiles(folderFiles, true);
      processedFiles++;
      setUploadProgress((processedFiles / totalFiles) * 100);
      console.log("Processed", folderName, result_simulation_id);
      simulationIds.push(result_simulation_id);
    }
    const ParameterSearches = {model_name, name, run_date, simulationIds, parameter_combinations};
    console.log(ParameterSearches);
    const response = await fetch('/parameter_searches', {
      method: 'POST',
      body: JSON.stringify(ParameterSearches),
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
      console.log('new parameterSearch added');
      setParameterSearchAlertVisible(true);  // Show the alert
      setTimeout(() => setParameterSearchAlertVisible(false), 3000);
      setTimeout(() => window.location.reload(), 2000);
      inputRef.current.value = "";
    }

    parameterSearchInputRef.current.value = "";
    setIsUploadActive(false);
  };

  const processFiles = async (files, parameter_search_bool) => {
    let processedFiles = 0;
    if (!parameter_search_bool) {
      setUploadProgress(1);
    }
    let parametersJsonData, simulation_run_name, model_name, creation_data, model_description;
    const stimuli = [];
    const expProtocols = [];
    const records = [];
    const results = [];
    const savedResults = [];
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
              const stimuli_data = new FormData();
              stimuli_data.append("code_name", code_name);
              stimuli_data.append("short_description", short_description);
              stimuli_data.append("long_description", long_description);
              stimuli_data.append("parameters", JSON.stringify(parameters));
              
              // Find the movie file in the files array
              const movieFile = Array.from(files).find(f => f.webkitRelativePath === movieFilePath);

              if (movieFile) {
                stimuli_data.append("movie", movieFile);
                stimuli.push(stimuli_data);
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
              const data = new FormData();
              data.append("code_name", code_name);
              data.append("name", name);
              data.append("parameters", JSON.stringify(parameters));
              data.append("caption", caption);

              // Find the figure file in the files array
              const figureFile = Array.from(files).find(f => f.webkitRelativePath === figurePath);
              if (figureFile) {
                data.append("figure", figureFile);
                results.push(data);
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
    

    const totalFiles = stimuli.length + expProtocols.length + records.length + results.length;

    for (var stimulus of stimuli) {
      if (!parameter_search_bool) {
        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      }
      const response = await fetch('/stimuli', {
        method: 'POST',
        body: stimulus
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
      if (!parameter_search_bool) {
        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      }
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
      if (!parameter_search_bool) {
        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      }
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
      if (!parameter_search_bool) {
        processedFiles++;
        setUploadProgress((processedFiles / totalFiles) * 100);
      }
      const response = await fetch('/results', {
        method: 'POST',
        body: result
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
    simulationWithParameters.from_parameter_search = parameter_search_bool;
  
    
    const response = await fetch('/simulation_runs', {
      method: 'POST',
      body: JSON.stringify(simulationWithParameters),
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
      console.log('new simulation added');
      if (!parameter_search_bool) {
        setAlertVisible(true);  // Show the alert
        setTimeout(() => setAlertVisible(false), 3000);
        setTimeout(() => window.location.reload(), 2000);
        inputRef.current.value = "";
      }
    }
    return json._id;
  };

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
        <Alert style={{ paddingLeft: 20, paddingRight: 20 }} color="success" isOpen={parameterSearchAlertVisible} toggle={() => setParameterSearchAlertVisible(false)}>
          Parameter search added successfully!
        </Alert>
      </div>
    )
}

export default NavBar