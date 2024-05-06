import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';

import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

import StimuliByIdsTableBody from "../components/StimuliByIdsTableBody";

const StimuliById = () => {
  const location = useLocation();
  const simulation = location.state;
  const [stimuli, setStimuli] = useState([]);
  useEffect(() => {

    // Fetch stimuli for the simulation
    const fetchStimuli = async () => {
      try {
        const response = await fetch(`/stimuli/` + simulation._id);
        const stimuli_data = await response.json();
        if (response.ok) {
          setStimuli(stimuli_data);
        }
      } catch (error) {
        console.error('Error fetching stimuli:', error);
      }
    };
    fetchStimuli();
  }, [simulation._id]);
  return (
    <div>
      <h1 className="text-center">Stimuli</h1>
      <Table
        bordered
        hover
        size="sm"
      >
        <thead style={{ textAlign: 'center'}}>
          <tr>
            <th>
              Source code name
            </th>
            <th>
              Short description
            </th>
            <th>
              Long description
            </th>
            <th>
              Parameters
            </th>
            <th>
              View
            </th>
          </tr>
        </thead>
        <tbody>   
          {stimuli.map(stimuli => (
            <StimuliByIdsTableBody key={stimuli._id} stimuli={stimuli} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StimuliById;
