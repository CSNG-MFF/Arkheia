import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from "react"
import _ from 'lodash'; // Import lodash

import { Container, Button, Form, FormGroup, Label, Input, Table } from 'reactstrap'; // Import Reactstrap components

const InspectResults = () => {
  
  const location = useLocation();
  const parameter_search = location.state;
  
  const [imageScale, setImageScale] = useState(1);

  const [selectedKey, setSelectedKey] = useState(null);

  const [parameterDifferences, setParameterDifferences] = useState({});
  const [isLoadingSimulations, setIsLoadingSimulations] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [simulations, setSimulations] = useState([]);
  const [results, setResults] = useState([]);

  const [availableResultNames, setAvailableResultNames] = useState([]); // For result name options

  const [selectedResults, setSelectedResults] = useState([]);
  const [selectedResultName, setSelectedResultName] = useState(''); // For tracking the selected result name



  const [selectedValues, setSelectedValues] = useState({});
  
  const [notSelectedValuesCombinations, setNotSelectedValuesCombinations] = useState({});

  useEffect(() => {
    if (!simulations.length && !isLoadingSimulations && !results.length && !isLoadingResults) { 
      setIsLoadingSimulations(true);
      setIsLoadingResults(true);

      const fetchData = async () => {
        if (parameter_search && parameter_search._id) {
          const response = await fetch(`/parameter_searches/${parameter_search._id}/simulations`);
          const json = await response.json();
          if (response.ok) {
            setSimulations(json);
            setIsLoadingSimulations(false);
            try {
              const allResults = []; // Array to store results from all simulations
          
              for (const simulation of json) {
                const response = await fetch(`/results/${simulation._id}`);
                const resultsData = await response.json();
                setAvailableResultNames(resultsData);
                if (response.ok) {
                  allResults.push(...resultsData); // Add results for this simulation
                } else {
                  console.error(`Error fetching results for simulation ${simulation._id}:`, response.statusText);
                }
              }
              setResults(allResults);
              setIsLoadingResults(false);
    
              const parameterVariations = {};

            for (const simulation of json) {
              addVariations(simulation.parameters.sheets, 'sheets', parameterVariations);
            }

            // Convert all sets to arrays for easier usage later on
            for (const key in parameterVariations) {
              parameterVariations[key] = Array.from(parameterVariations[key]);
              if (parameterVariations[key].length <= 1) {
                delete parameterVariations[key];
              }
            }

            setParameterDifferences(parameterVariations);
            } catch (error) {
              console.error('Error fetching results (general):', error);
            }
          }
        }
      }
      fetchData();
    }
  }, [])

  useEffect(() => {
    if (parameterDifferences) {
      setSelectedValues(
        Object.keys(parameterDifferences).reduce((acc, key) => {
          acc[key] = parameterDifferences[key].slice(); // start with all values selected
          return acc;
        }, {})
      );
      const firstKey = Object.keys(parameterDifferences)[0];
      if (firstKey) {
        setSelectedKey(firstKey);
      }
    }
  }, [parameterDifferences]);

  useEffect(() => {
    if (selectedValues && selectedKey) {
      const keys = Object.keys(selectedValues).filter(key => key !== selectedKey);
      const combinations = [];
  
      const generateCombinations = (index, currentCombination) => {
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
      console.log(combinations);
      setNotSelectedValuesCombinations(combinations);
    }
  }, [selectedValues, selectedKey]);

  useEffect(() => {
    if (availableResultNames.length > 0) {
      const firstResult = availableResultNames[0];
      setSelectedResultName(firstResult.name);
      const matchingResults = results.filter((result) => result.name === firstResult.name);
      setSelectedResults([...matchingResults]);
    }
  }, [availableResultNames]);

  const handleResultChange = (event) => {
    setSelectedResults([]);
    const selectedName = event.target.value;
    const matchingResults = results.filter((result) => result.name === selectedName);
    setSelectedResults([...matchingResults]);
    setSelectedResultName(selectedName);
  };

  const handleScaleChange = (event) => {
    setImageScale(parseFloat(event.target.value).toFixed(2)); // Limit to 2 decimal places
  };
  const toggleSelection = (key, value) => {
    setSelectedValues(prevState => {
      // Create a deep copy of prevState to avoid directly mutating state
      const newSelectedKeys = JSON.parse(JSON.stringify(prevState));
  
      // Check if key exists in newSelectedKeys, if not initialize it
      if (!newSelectedKeys[key]) {
        newSelectedKeys[key] = [];
      }
  
      const index = newSelectedKeys[key].indexOf(value);
  
      if (index === -1) {
        newSelectedKeys[key].push(value); // select
      } else if (newSelectedKeys[key].length > 1) {
        newSelectedKeys[key].splice(index, 1); // deselect if not the last one
      }
      return newSelectedKeys;
    });
  };

  return (
    <Container> {(isLoadingSimulations || isLoadingResults) ? (
        <div>Loading...</div>
      ) : ( 
        <div>
        { results.length > 0 && (
          <div>
            <h2>Select Result</h2>
            <Form>
              <FormGroup>
                <Label for="resultSelect">Result</Label>
                <Input
                  type="select"
                  id="resultSelect"
                  value={selectedResultName}
                  onChange={handleResultChange}
                >
                  {availableResultNames.map((result) => (
                    <option key={result._id} value={result.name}>
                      {result.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Form>
            <div>
              <label htmlFor="scaleSlider">Image Scale</label>
              <input
                type="range"
                id="scaleSlider"
                min="0.1"
                max="3"  
                step="0.01"  // Smaller step for smoother transitions
                value={imageScale}
                onChange={handleScaleChange}
                style={{ width: '300px' }}
              />
            </div>
            {parameterDifferences && Object.keys(parameterDifferences).length > 0 && (
              <div>
                {Object.keys(parameterDifferences).map((key) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      style={{ margin: '10px'}}
                      color={key === selectedKey ? 'primary' : 'secondary'}
                      onClick={() => setSelectedKey(key)}
                    >
                      {key}
                    </Button>
                    {parameterDifferences[key].map((value, index) => {
                      const isSelected = selectedValues[key] && selectedValues[key].includes(value);
                      const isLastSelected = isSelected && selectedValues[key].length === 1;

                      return (
                        <Button 
                          color={isLastSelected ? 'danger' : isSelected ? 'success' : 'secondary'}
                          key={index}
                          style={{ margin: '10px'}}
                          onClick={() => !isLastSelected && toggleSelection(key, value)}
                          disabled={isLastSelected}
                        >
                          {value}
                        </Button>
                      );
                    })}

                  </div>
                ))}
              </div>
            )}

            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <Container>
                <Table>
                  <thead>
                    <tr>
                      <th></th>
                      {notSelectedValuesCombinations && Object.keys(notSelectedValuesCombinations).map((key, index) => (
                        <th key={index}>
                          {Object.entries(notSelectedValuesCombinations[key]).map(([subKey, subValue]) => (
                            <React.Fragment key={subKey}>
                              {subKey}: {subValue}
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
                        <th scope="row">{selectedKey}: {value}</th>
                        {notSelectedValuesCombinations && Object.keys(notSelectedValuesCombinations).map((key) => (
                          <td key={key}>
                          {(() => {
                            const allKeysValues = Object.entries(notSelectedValuesCombinations[key]).concat([[selectedKey, value]]);
                            const simulationMatch = simulations.find(simulation =>
                              allKeysValues.every(([key, val]) => _.get(simulation.parameters, key) === val)
                            );

                            if (simulationMatch) {
                              return results
                                .filter(result => result.name === selectedResultName)
                                .map(result => (
                                  <img
                                    key={result._id}
                                    src={`/results/${result._id}/image`}
                                    alt="Result Figure"
                                    style={{
                                      maxWidth: '100%',
                                      height: 'auto',
                                      transform: `scale(${imageScale})`,
                                      marginRight: '10px'
                                    }}
                                  />
                                ));
                            }
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
    </Container>
  );
};



export default InspectResults

function addVariations(obj, path, parameterVariations) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If the value is an object, recursively search it
      addVariations(obj[key], `${path}.${key}`, parameterVariations);
    } else {
      // If the value is not an object, add it to the variations
      const fullPath = `${path}.${key}`;
      if (parameterVariations[fullPath]) {
        parameterVariations[fullPath].add(obj[key]);
      } else {
        parameterVariations[fullPath] = new Set([obj[key]]);
      }
    }
  }
}