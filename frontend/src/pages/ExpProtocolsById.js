import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';

import {
  Table,
  UncontrolledTooltip
} from 'reactstrap'

import ExpProtocolByIdsTableBody from "../components/ExpProtocolByIdsTableBody";
import RecordByIdsTableBody from "../components/RecordByIdsTableBody";

/**
 * 
 * @returns The experimental protocols and the recorders of a simulation
 */
const ExpProtocolsById = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const simulation = location.state;
  const [expProtocol, setExpProtocol] = useState([]);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    // Fetch experimental protocols connected with the simulation
    const fetchExpProtocols = async () => {
      try {
        const response = await fetch(`${apiUrl}/exp_protocols/` + simulation._id);
        const exp_protocol_data = await response.json();
        if (response.ok) {
          setExpProtocol(exp_protocol_data);
        }
      } catch (error) {
        console.error('Error fetching experimental protocols:', error);
      }
    };
    fetchExpProtocols();
  }, [simulation._id]);

  useEffect(() => {
    // Fetch records for the simulation
    const fetchRecords = async () => {
      try {
        const response = await fetch(`${apiUrl}/records/` + simulation._id);
        const record = await response.json();
        if (response.ok) {
          setRecord(record);
        }
      } catch (error) {
        console.error('Error fetching experimental protocols:', error);
      }
    };
    fetchRecords();
  }, [simulation._id]);
  return (
    <div>
      <h1 className="text-center">Experimental Protocols</h1>
      <Table
        bordered
        hover
        size="sm"
      >
        <thead style={{ textAlign: 'center'}}>
          <tr>
            <th id="SourceName">
              Source code name
            </th>
            <UncontrolledTooltip
              target="SourceName"
            >
              The source code identifier that generates the given instance of Experimental Protocol configuration (e.g. a class or function name).
            </UncontrolledTooltip>
            <th id="ShortDescription">
              Short description
            </th>
            <UncontrolledTooltip
              target="ShortDescription"
            >
              Brief description of the experimental protocol configuration.
            </UncontrolledTooltip>
            <th id="LongDescription">
              Long description
            </th>
            <UncontrolledTooltip
              target="LongDescription"
            >
              Detailed description of the experimental protocol configuration.
            </UncontrolledTooltip>
            <th id="Parameters">
              Parameters
            </th>
            <UncontrolledTooltip
              target="Parameters"
            >
              The parameters and their values of the given experimental protocol configuration.
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>   
          {expProtocol.map(expProtocol => (
            <ExpProtocolByIdsTableBody key={expProtocol._id} expProtocol={expProtocol} />
          ))}
        </tbody>
      </Table>
      <h1 className="text-center">Records</h1>
      <Table
      bordered
      hover
      size="sm"
      >
        <thead style={{ textAlign: 'center'}}>
          <tr>
            <th id="SourceNameRecord"> 
              Source code name
            </th>
            <UncontrolledTooltip
              target="SourceNameRecord"
            >
              The source code identifier that generates this instance of Recording configuration (e.g. a class or function name).
            </UncontrolledTooltip>
            <th id="TargetPopulation">
              Target population
            </th>
            <UncontrolledTooltip
              target="TargetPopulation"
            >
              Identifier of the neural popullation in which the recordings were performed.
            </UncontrolledTooltip>
            <th id="Variables">
              Recorded variables	
            </th>
            <UncontrolledTooltip
              target="Variables"
            >
              The variables that were recorded in the selected neurons (i.e. spikes, membrane potential etc.).
            </UncontrolledTooltip>
            <th id="ShortDescriptionRecord"> 
              Short description
            </th>
            <UncontrolledTooltip
              target="ShortDescriptionRecord"
            >
              Brief description of the recording configuration.
            </UncontrolledTooltip>
            <th id="LongDescriptionRecord">
              Long description
            </th>
            <UncontrolledTooltip
              target="LongDescriptionRecord"
            >
              Detailed description of the recording configuration.
            </UncontrolledTooltip>
            <th id="ParametersRecord">
              Parameters
            </th>
            <UncontrolledTooltip
              target="ParametersRecord"
            >
              The parameters and their values of the given recording configuration.
            </UncontrolledTooltip>
          </tr>
        </thead>
        <tbody>   
          {record.map(record => (
            <RecordByIdsTableBody key={record._id} record={record} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ExpProtocolsById;
