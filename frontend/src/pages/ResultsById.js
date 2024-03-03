import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';

import {
  Table
} from 'reactstrap'

import ResultByIdsTableBody from "../components/ResultByIdsTableBody";

const ResultsById = () => {
  const location = useLocation();
  const simulation = location.state;
  const [results, setResults] = useState([]);
  useEffect(() => {
    // Fetch stimuli for the simulation
    const fetchResults = async () => {
      try {
        const response = await fetch(`/results/` + simulation._id);
        const resultsData = await response.json();
        if (response.ok) {
          setResults(resultsData);
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
            <th>
              Source name	
            </th>
            <th>
              Name
            </th>
            <th>
              Parameters
            </th>
            <th>
              Caption
            </th>
            <th>
              Figure
            </th>
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
