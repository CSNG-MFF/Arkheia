import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';

import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

import ResultByIdsTableBody from "../components/ResultByIdsTableBody";

const ResultsById = () => {
  const location = useLocation();
  const simulation = location.state;
  const [results, setResults] = useState([]);
  useEffect(() => {
    // Fetch results for the simulation
    const fetchResults = async () => {
      try {
        const response = await fetch(`/results/` + simulation._id);
        const results_data = await response.json();
        if (response.ok) {
          setResults(results_data);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };
    fetchResults();
  }, [simulation._id]);
  return (
    <div>
      <h1 className="text-center">Results</h1>
      <Table
      bordered
      hover
      size="sm"
      >
        <thead style={{ textAlign: 'center'}}>
          <tr>
            <th id="SourceName">
              Source name	
            </th>
            <UncontrolledTooltip
              target="SourceName"
            >
              The source code identifier that generates the given figure (e.g. a class or function name).
            </UncontrolledTooltip>
            <th id="Name">
              Name
            </th>
            <UncontrolledTooltip
              target="Name"
            >
              The name of the figure.
            </UncontrolledTooltip>
            <th id="Parameters">
              Parameters
            </th>
            <UncontrolledTooltip
              target="Parameters"
            >
              The parameters with which the source code that generated the figure was invoked with.
            </UncontrolledTooltip>
            <th id="Caption">
              Caption
            </th>
            <UncontrolledTooltip
              target="Caption"
            >
              The figure caption. Click the eye icon to show the text.
            </UncontrolledTooltip>
            <th id="Figure">
              Figure
            </th>
            <UncontrolledTooltip
              target="Figure"
            >
              The figure. Click to enlarge the figure.
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>   
          {results.map(result => (
            <ResultByIdsTableBody key={result._id} result={result} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResultsById;
