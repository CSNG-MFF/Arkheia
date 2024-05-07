import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from "react"
import _ from 'lodash'; // Import lodash

import { Container, Button, Form, FormGroup, Label, Input, Table, Modal, ModalBody, ModalFooter } from 'reactstrap'; // Import Reactstrap components

import '../styles/inspect_results.css'

/**
 * 
 * @returns The inspect results page
 */
const InspectResults = () => {
  
  const location = useLocation();
  const parameter_search = location.state;
  
  // Controls the visibility of the modal
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Controls the scale of the images inside the grid table
  const [imageScale, setImageScale] = useState(0.5);

  // Controls the X axis of the table using the selected key
  const [selectedKey, setSelectedKey] = useState(null);

  // The combinations of the parameters
  const [parameterDifferences, setParameterDifferences] = useState({});

  // Helper boolean for checking if simualtions are loading
  const [isLoadingSimulations, setIsLoadingSimulations] = useState(false);

  // Helper boolean for checking if the results are loading
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // The simulations inside the page
  const [simulations, setSimulations] = useState([]);

  // The results inside the webpage
  const [results, setResults] = useState([]);

  // The avalaible result names
  const [availableResultNames, setAvailableResultNames] = useState([]);

  // The selected result name
  const [selectedResultName, setSelectedResultName] = useState('');

  // The seelcted values of the parameter combinations
  const [selectedValues, setSelectedValues] = useState({});
  
  // The Y axis of the table based on the not selected value combinations
  const [notSelectedValuesCombinations, setNotSelectedValuesCombinations] = useState({});

  const toggleViewModal = () => {
    setViewModalOpen(!viewModalOpen);
  }

  useEffect(() => {
    if (!simulations.length && !isLoadingSimulations && !results.length && !isLoadingResults) { 
      setIsLoadingSimulations(true);
      setIsLoadingResults(true);

      const fetchData = async () => { // Fetch the needed data for the page
        if (parameter_search && parameter_search._id) {
          const response = await fetch(`/parameter_searches/${parameter_search._id}/simulations`);
          const json = await response.json();
          if (response.ok) {
            setSimulations(json);
            setIsLoadingSimulations(false);
            try {
              const all_results = []; // Array to store results from all simulations
              let avalaible_names = new Set();
              const response = await fetch(`/parameter_searches/${parameter_search._id}/results`);
              const results_data = await response.json();
              if (response.ok) {
                for (const results of results_data) {
                  for (const result of results) {
                    if (result.name) {
                      avalaible_names.add(result.name); // Add result name to the set
                    }
                    all_results.push(result); // Add results for this simulation
                  }
                }
              } else {
                console.error(`Error fetching results for parameter search ${parameter_search._id}:`, response.statusText);
              }              
              setAvailableResultNames([...avalaible_names]); // Set the names of all the avalaible results
              setResults(all_results); // Set the results inside the page
              setIsLoadingResults(false); // Not loading the results anymore
              
              let parameter_variations = {}; 

              if (parameter_search.parameter_combinations) {
                parameter_variations = parameter_search.parameter_combinations;
              }
              else {
                for (const simulation of json) {
                  addVariations(simulation.parameters.sheets, 'sheets', parameter_variations);
                }
              }
              for (const key in parameter_variations) {
                parameter_variations[key] = Array.from(parameter_variations[key]);
                if (parameter_variations[key].length <= 1) {
                  delete parameter_variations[key];
                }
              }
              setParameterDifferences(parameter_variations); // Set the parameter combinations
            } catch (error) {
              console.error('Error fetching results (general):', error);
            }
          }
        }
      }
      fetchData();
    }
  }, [isLoadingResults, isLoadingSimulations, parameter_search, results.length, simulations.length])
 
  useEffect(() => {
    if (parameterDifferences) { // If the parameter combinations are set
      setSelectedValues( // Sets the first values to be selected
        Object.keys(parameterDifferences).reduce((acc, key) => {
          acc[key] = parameterDifferences[key].slice(); // Start with all values selected
          return acc;
        }, {})
      );
      const first_key = Object.keys(parameterDifferences)[0];
      if (first_key) {
        setSelectedKey(first_key);
      }
    }
  }, [parameterDifferences]);

  useEffect(() => {
    if (selectedValues && selectedKey) { // If the key is selected
      const keys = Object.keys(selectedValues).filter(key => key !== selectedKey);
      const combinations = [];
  
      const generateCombinations = (index, currentCombination) => { // Generates all of the combinations to be inside the grid
        if (index === keys.length) {
          combinations.push({ ...currentCombination });
          return;
        }
  
        selectedValues[keys[index]].forEach(value => {
          currentCombination[keys[index]] = value;
          generateCombinations(index + 1, currentCombination);
          delete currentCombination[keys[index]];
        });
      };
  
      generateCombinations(0, {});
      setNotSelectedValuesCombinations(combinations);
    }
  }, [selectedValues, selectedKey]);

  useEffect(() => {
    if (availableResultNames.length > 0) { // Sets the first avalaible result, this is important, to show immediately something on the page
      const first_result = availableResultNames[0];
      setSelectedResultName(first_result);
    }
  }, [availableResultNames]);

  const handleResultChange = (event) => { // Sets the selected name if te user changes it
    const selected_name = event.target.value;
    setSelectedResultName(selected_name);
  };

  const handleScaleChange = (event) => { // Changes the styles of the images to accomodate the image scale
    setImageScale(parseFloat(event.target.value).toFixed(2));
    const scale = event.target.value;
    const images = document.querySelectorAll('img');
    const headers = document.querySelectorAll('thead tr th');
    images.forEach(img => {
      img.style.width = `${scale * 800}px`;
    });
    headers.forEach(header => {
      header.style.fontSize = `${scale * 1}em`;
    })
  };
  const toggleSelection = (key, value) => {
    setSelectedValues(prevState => {
      const new_selected_keys = JSON.parse(JSON.stringify(prevState));
  
      // Check if key exists in new_selected_keys, if not initialize it
      if (!new_selected_keys[key]) {
        new_selected_keys[key] = [];
      }
  
      const index = new_selected_keys[key].indexOf(value);
      if (index === -1) {
        new_selected_keys[key].push(value); // Select
      } else if (new_selected_keys[key].length > 1) {
        new_selected_keys[key].splice(index, 1); // Deselect if not the last one
      }
      return new_selected_keys;
    });
  };

  return (
    <div> {(isLoadingSimulations) ? (
        <div> <h1>Loading... </h1></div>
      ) : ( 
        <div>
        { results.length > 0 && (
          <div>
            <h2 style={{ paddingLeft: '25px', textAlign: 'center'}}>Inspect results</h2>
            <Form style={{ paddingLeft: '25px'}}>
              <FormGroup>
                <Label for="resultSelect">Result</Label>
                <Input
                  type="select"
                  id="resultSelect"
                  value={selectedResultName}
                  onChange={handleResultChange}
                  style={{ maxWidth: '30%'}}
                >
                  {availableResultNames.map((resultName) => (
                    <option key={resultName} value={resultName}>
                      {resultName}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Form>
            <div style={{ paddingLeft: '25px'}}>
              <label htmlFor="scaleSlider" style={{paddingRight: '25px',}}>Image Scale</label>
              <input 
                type="range"
                id="scaleSlider"
                min="0.35"
                max="1.5"  
                step="0.01"
                value={imageScale}
                onChange={handleScaleChange}
                style={{ width: '500px'}}
              />
            </div>
            {parameterDifferences && Object.keys(parameterDifferences).length > 0 && (
              <div style={{ paddingLeft: '25px'}}>
                {Object.keys(parameterDifferences).map((key) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      style={{ margin: '2px'}}
                      color={key === selectedKey ? 'primary' : 'secondary'}
                      onClick={() => setSelectedKey(key)}
                    >
                      {String(key)}
                    </Button>
                    {parameterDifferences[key].map((value, index) => {
                      const is_selected = selectedValues[key] && selectedValues[key].includes(value);
                      const is_last_selected = is_selected && selectedValues[key].length === 1;

                      return (
                        <Button 
                          color={is_last_selected ? 'danger' : is_selected ? 'success' : 'secondary'}
                          key={index}
                          style={{ margin: '2px'}}
                          onClick={() => !is_last_selected && toggleSelection(key, value)}
                          disabled={is_last_selected}
                        >
                          {String(value)}
                        </Button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            <div className='no-padding'>
              <Container fluid style={{ padding: 0 }}>
                <Table bordered hover className="fixed-header" >
                  <thead>
                    <tr style={{ position: 'sticky', left: 0, backgroundColor: 'white' }}>
                      <th></th>
                      {notSelectedValuesCombinations && Object.keys(notSelectedValuesCombinations).map((key, index) => (
                        <th key={index} style={{ textAlign: 'center', fontSize: `${imageScale * 1}em`}}>
                          {Object.entries(notSelectedValuesCombinations[key]).map(([subKey, subValue]) => (
                            <React.Fragment key={subKey}>
                              {subKey}: {String(subValue)}
                              <br />
                            </React.Fragment>
                          ))}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedValues && selectedValues[selectedKey] && selectedValues[selectedKey].map((value, index) => (
                      <tr key={index}>
                        <th scope="row" style={{ textAlign: 'center', verticalAlign: 'middle', fontSize: '0.5em'}}>
                          {String(value)}
                        </th>
                        {notSelectedValuesCombinations && Object.keys(notSelectedValuesCombinations).map((key) => (
                          <td key={key}>
                          {(() => {
                            const all_keys_values = Object.entries(notSelectedValuesCombinations[key]).concat([[selectedKey, value]]);
                            const simulation_match = simulations.find(simulation =>
                              all_keys_values.every(([key, val]) => _.get(simulation.parameters, key) === val)
                            );

                            if (simulation_match) {
                              const result = results.find(result => 
                                result.name === selectedResultName && simulation_match.results.includes(result._id)
                              );
                              if (result) {
                                return (
                                  <div>
                                    <Button
                                      className="icon-button" 
                                      id={`view_${result._id}`}
                                      type="button"
                                      onClick={toggleViewModal}
                                    >
                                      <img
                                        key={result._id}
                                        src={`/results/${result._id}/image`}
                                        alt="Result Figure"
                                        style={{ width: `${imageScale * 800}px`}}
                                      />
                                    </Button>
                                    <Modal
                                      target={`view_${result._id}`}
                                      isOpen={viewModalOpen}
                                      toggle={toggleViewModal}
                                      style={{ maxWidth: '90%', maxHeight: '90%', height: 'auto' }}
                                      >
                                    <ModalBody>
                                      <img
                                        src={`/results/${result._id}/image`} 
                                        alt="Result Figure"
                                        style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                      <Button color="primary" onClick={toggleViewModal}>
                                        Close
                                      </Button>
                                    </ModalFooter>
                                  </Modal>
                                </div>
                                );
                              }
                            }
                            return '';
                          })()}
                        </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Container>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};



export default InspectResults

// ONLY USED WHEN PARAMETER COMBINATIONS ARE NOT DEFINED

/**
 * 
 * @param obj The object to be searched trough
 * @param path The path of the object
 * @param parameter_variations The place to save the parameter variations
 */
function addVariations(obj, path, parameter_variations) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If the value is an object, recursively search it
      addVariations(obj[key], `${path}.${key}`, parameter_variations);
    } else {
      // If the value is not an object, add it to the variations
      const fullPath = `${path}.${key}`;
      if (parameter_variations[fullPath]) {
        parameter_variations[fullPath].add(obj[key]);
      } else {
        parameter_variations[fullPath] = new Set([obj[key]]);
      }
    }
  }
}