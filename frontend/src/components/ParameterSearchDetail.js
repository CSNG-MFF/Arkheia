import { IoTrashSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, Alert  } from "reactstrap";

import '../styles/simulation_button.css'

const ParameterSearchDetail = ({ parameter_search }) => {
  const history = useNavigate();
  const [alertDeleteVisible, setAlertDeleteVisible] = useState(false);

  const handleSimulationsView = () => {
    const id = parameter_search._id;
    history(`/simulation_runs/${id}`, { state: parameter_search });
  }

  const handleInspectResults = () => {
    const id = parameter_search._id;
    history(`/inspect_results/${id}`, { state: parameter_search });
  }
  const handleDelete = async () => {
    if (parameter_search && parameter_search._id) {
      const response = await fetch(`/parameter_searches/${parameter_search._id}/simulations`);
      const json = await response.json();
      if (response.ok) {
        if (json) {
          for (const simulation of json) {
            const response = await fetch('/simulation_runs/' + simulation._id, {
              method: 'DELETE'
            })
              
            for (const stimulusId of simulation.stimuli) {
              const deleteResponse = await fetch('/stimuli/' + stimulusId, {
                method: 'DELETE'
              });
              const deleteJson = await deleteResponse.json();
              
              if (!deleteResponse.ok) {
                throw new Error(deleteJson.error);
              }
            }
        
            for (const expProtocolId of simulation.exp_protocols) {
              const deleteResponse = await fetch('/exp_protocols/' + expProtocolId, {
                method: 'DELETE'
              });
              const deleteJson = await deleteResponse.json();
              
              if (!deleteResponse.ok) {
                throw new Error(deleteJson.error);
              }
            }
        
            for (const recordId of simulation.records) {
              const deleteResponse = await fetch('/records/' + recordId, {
                method: 'DELETE'
              });
              const deleteJson = await deleteResponse.json();
              
              if (!deleteResponse.ok) {
                throw new Error(deleteJson.error);
              }
            }
        
            for (const resultId of simulation.results) {
              const deleteResponse = await fetch('/results/' + resultId, {
                method: 'DELETE'
              });
              const deleteJson = await deleteResponse.json();
              
              if (!deleteResponse.ok) {
                throw new Error(deleteJson.error);
              }
            }
          }
        }
      }
    }
    const response = await fetch('/parameter_searches/' + parameter_search._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (!response.ok) {
      console.error(json.error);
      window.location.reload();
    }

    if (response.ok) {
      setAlertDeleteVisible(true);  // Show the alert
      setTimeout(() => setAlertDeleteVisible(false), 3000);
      setTimeout(() => window.location.reload(), 2000);
    }
  }
  return (
    <>
    <Alert style={{ position: 'absolute', width: '100%' }} color="danger" isOpen={alertDeleteVisible} toggle={() => setAlertDeleteVisible(false)}>
      Parameter Search deleted!
    </Alert>
    <tr style={{ textAlign: 'center', verticalAlign: 'middle'}}>
      <td>
        {new Date(parameter_search.createdAt).toLocaleString('en-GB')}
      </td>
      <td>
        {new Date(parameter_search.run_date).toLocaleString('en-GB')}
      </td>
      <td>
        {parameter_search.name}
      </td>
      <td>
        {parameter_search.model_name}
      </td>
      <td style={{ textAlign: 'center', padding: 0 }}>
        <Button className="icon-button" onClick={handleSimulationsView} >
          <IoEye size={28} className="icon"/>
        </Button>
      </td>
      <td style={{ textAlign: 'center', padding: 0 }}>
        <Button className="icon-button" onClick={handleInspectResults}>
          <IoEye size={28} className="icon" />
        </Button>
      </td>
      <td style={{ textAlign: 'center', padding: 0 }} >
        <Button className="icon-button" onClick={handleDelete}>
          <IoTrashSharp size={28} className="icon" />
        </Button>
      </td>
    </tr>
    </>
  )
}

export default ParameterSearchDetail;