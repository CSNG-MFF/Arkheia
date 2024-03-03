import { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';

import {
  Table
} from 'reactstrap'

import ExpProtocolByIdsTableBody from "../components/ExpProtocolByIdsTableBody";
import RecordByIdsTableBody from "../components/RecordByIdsTableBody";

const ExpProtocolsById = () => {
  const location = useLocation();
  const simulation = location.state;
  const [expProtocol, setExpProtocol] = useState([]);
  const [record, setRecord] = useState([]);

  useEffect(() => {
    // Fetch stimuli for the simulation
    const fetchExpProtocols = async () => {
      try {
        const response = await fetch(`/exp_protocols/` + simulation._id);
        const expProtocolData = await response.json();
        if (response.ok) {
          setExpProtocol(expProtocolData);
        }
      } catch (error) {
        console.error('Error fetching experimental protocols:', error);
      }
    };
    fetchExpProtocols();
  }, [simulation._id]);

  useEffect(() => {
    // Fetch stimuli for the simulation
    const fetchRecords = async () => {
      try {
        const response = await fetch(`/records/` + simulation._id);
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
            <th>
              Source code name
            </th>
            <th>
              Target population
            </th>
            <th>
              Recorded variables	
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
