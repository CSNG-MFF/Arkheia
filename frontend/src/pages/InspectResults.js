import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from "react"

import { Container, Button, Row, Col, Form, FormGroup, Label, Input, Table } from 'reactstrap'; // Import Reactstrap components

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


  const [selectedKeys, setSelectedKeys] = useState({});


  useEffect(() => {
    if (!simulations.length && !isLoadingSimulations && !results.length && !isLoadingResults) { // Check if simulations are empty and not already loading
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
      setSelectedKeys(
        Object.keys(parameterDifferences).reduce((acc, key) => {
          acc[key] = parameterDifferences[key].slice(); // start with all values selected
          return acc;
        }, {})
      );
      const firstKey = Object.keys(parameterDifferences)[0];
      if (firstKey) {
        setSelectedKey(firstKey);
      }
      const otherKeys = Object.keys(parameterDifferences).filter(key => key !== selectedKey);

      // Generate all combinations of other key values
      let combinations = otherKeys.flatMap(key => 
        parameterDifferences[key].map(value => ({ [key]: value }))
      );

      // Generate the table
      let table = {};
      if (parameterDifferences[selectedKey]) {
        parameterDifferences[selectedKey].forEach(xValue => {
          table[xValue] = {};
          combinations.forEach(combination => {
            // Find a simulation that matches the combination and xValue
            const matchingSimulation = simulations.find(simulation => 
              Object.entries(combination).every(([key, value]) => 
                simulation.parameters.sheets[key] === value
              ) && simulation.parameters.sheets[selectedKey] === xValue
            );
            // If a matching simulation is found, add its name to the table
            if (matchingSimulation) {
              table[xValue][JSON.stringify(combination)] = matchingSimulation.simulation_run_name;
            }
          });
        });
      }     
      console.log("table: ", table);
    }
  }, [parameterDifferences]);

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
    setSelectedKeys(prevState => {
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
                  <option value="">Select a Result</option>
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
                style={{ width: '300px' }} // Or adjust to your desired width
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
                      {console.log(selectedKey)}
                      {key}
                    </Button>
                    {parameterDifferences[key].map((value, index) => {
                      const isSelected = selectedKeys[key] && selectedKeys[key].includes(value);
                      const isLastSelected = isSelected && selectedKeys[key].length === 1;

                      return (
                        <Button 
                          color={isLastSelected ? 'danger' : isSelected ? 'success' : 'secondary'}
                          key={index}
                          style={{ margin: '10px'}}
                          onClick={() => !isLastSelected && toggleSelection(key, value)}
                          disabled={isLastSelected}
                        >
                          {console.log(selectedKeys)}
                          {value}
                        </Button>
                      );
                    })}

                  </div>
                ))}
              </div>
            )}
            
            {selectedResults && selectedResults.length > 0 && (
              <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {selectedResults.map((result) => (
                  <img
                    key={result._id} // Important: Unique key for each image
                    src={`/results/${result._id}/image`}
                    alt="Result Figure"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      transform: `scale(${imageScale})`,
                      marginRight: '10px'
                    }}
                  />
                ))}
              </div>
            )}
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