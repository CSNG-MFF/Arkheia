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
            <th id="SourceCode">
              Source code name
            </th>
            <UncontrolledTooltip
              target="SourceCode"
            >
              The source code identifier that generates the given instance of Stimulus (e.g. a class or function name)
            </UncontrolledTooltip>
            <th id="ShortDescription">
              Short description
            </th>
            <UncontrolledTooltip
              target="ShortDescription"
            >
              Brief description of the recording configuration.
            </UncontrolledTooltip>
            <th id="LongDescription">
              Long description
            </th>
            <UncontrolledTooltip
              target="LongDescription"
            >
              Detailed description of the recording configuration.
            </UncontrolledTooltip>
            <th id="Parameters">
              Parameters
            </th>
            <UncontrolledTooltip
              target="Parameters"
            >
              Click the eye icon to inspect the parameters and their values of the given stimulus instance.
            </UncontrolledTooltip>
            <th id="View">
              View
            </th>
            <UncontrolledTooltip
              target="View"
            >
              The stimulus movie. Note that due to frame-rate cap in web-browsers the speed of the movies does not neccessarily correspond to the speed at which they were presented during simulation.
            </UncontrolledTooltip>
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
