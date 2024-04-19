import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react"

import { Container, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap'; // Import Reactstrap components

const InspectResults = () => {
  
  const location = useLocation();
  const parameter_search = location.state;
  
  const [imageScale, setImageScale] = useState(1);

  const [simulations, setSimulations] = useState(null);
  const [results, setResults] = useState([]);

  const [differences, setDifferences] = useState([]); 
  const [selectedResult, setSelectedResult] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);

  useEffect(() => {
    const fetchSimulations = async () => {
      if (parameter_search && parameter_search._id) {
        const response = await fetch(`/parameter_searches/${parameter_search._id}/simulations`);
        const json = await response.json();
        if (response.ok) {
          setSimulations(json);
        }
      }
    }
    const calculateDifferences = () => {
      if (simulations) {
        const allDifferences = [];
        for (let i = 0; i < simulations.length; i++) {
          for (let j = i + 1; j < simulations.length; j++) {
            const diffs = compareParameters(
              simulations[i].parameters,
              simulations[j].parameters
            );
            allDifferences.push({ 
              sim1: simulations[i].simulation_run_name, // Or whatever identifies a simulation 
              sim2: simulations[j].simulation_run_name, 
              diffs 
            });
          }
        }
        setDifferences(allDifferences);
      }
    };
    const fetchResults = async () => {
      try {
        const response = await fetch(`/results/` + simulations[0]._id);
        const resultsData = await response.json();
        if (response.ok) {
          setResults(resultsData);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    fetchResults();
    fetchSimulations();
    calculateDifferences();
  }, [simulations])

  const handleResultChange = (event) => {
    const selectedName = event.target.value;
    const selectedResultData = results.find((result) => result.name === selectedName);
    setSelectedResult(selectedResultData);
  };

  const handleScaleChange = (event) => {
    setImageScale(parseFloat(event.target.value));
  };
  return (
    <Container> {/* Use Reactstrap's Container for basic layout */}
          {results.length > 0 && (
            <div>
              <h2>Select Result</h2>
              <Form> {/* Use Reactstrap's Form for layout */}
                <FormGroup>
                  <Label for="resultSelect">Result</Label>
                  <Input
                    type="select"
                    id="resultSelect"
                    value={selectedResult?.name || ''}
                    onChange={handleResultChange}
                  >
                    <option value="">Select a Result</option>
                    {results.map((result) => (
                      <option key={result._id} value={result.name}>
                        {result.name}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Form>

              {selectedResult && (
                <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}> {/* Scrollable container */}
                  <img
                    src={`/results/${selectedResult._id}/image`} 
                    alt="Result Figure"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      transform: `scale(${imageScale})`
                    }}
                  />
                </div>
              )}

              <div>
                <label htmlFor="scaleSlider">Image Scale</label>
                <input
                  type="range"
                  id="scaleSlider"
                  min="0.1"
                  max="3"  
                  step="0.1"  
                  value={imageScale}
                  onChange={handleScaleChange}
                />
              </div>
            </div>
          )}
    </Container>
  );
};

export default InspectResults

function compareParameters(parameters1, parameters2, depth = 1) {
  const differences = [];

  // Ensure both simulations have a 'sheets' object
  if (parameters1.sheets && parameters2.sheets) {
    const sheets1 = parameters1.sheets;
    const sheets2 = parameters2.sheets;

    for (const sheetName in sheets1) {
      if (!sheets2.hasOwnProperty(sheetName) || !isEqual(sheets1[sheetName], sheets2[sheetName])) {
          differences.push({ path: `sheets.${sheetName}`, value1: sheets1[sheetName], value2: sheets2[sheetName] });
      }

      // Recursive comparison for deeper levels (if desired)
      if (depth > 1 && typeof sheets1[sheetName] === 'object') {
        const nestedDifferences = compareParameters(sheets1[sheetName], sheets2[sheetName], depth - 1);
        differences.push(...nestedDifferences.map(diff => ({ path: `sheets.${sheetName}.${diff.path}`, ...diff })));
      }
    }
  }

  return differences;
}

// Helper function for basic equality check (you might need a more robust one for complex objects)
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2); 
}