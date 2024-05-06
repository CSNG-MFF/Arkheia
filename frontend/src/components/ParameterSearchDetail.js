import { IoTrashSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";

import React, { useState } from 'react'

import { Button, Alert  } from "reactstrap";

import '../styles/simulation_button.css'

const ParameterSearchDetail = ({ parameter_search }) => {
  const history = useNavigate();

   // Controls the visibility of the alert for deletion
  const [alertDeleteVisible, setAlertDeleteVisible] = useState(false);

  // If the user want to see the individual simulation runs
  const handleSimulationsView = () => {
    const id = parameter_search._id;
    history(`/simulation_runs/${id}`, { state: parameter_search });
  }

  // If the user wants to inspect the results of the parameter search
  const handleInspectResults = () => {
    const id = parameter_search._id;
    history(`/inspect_results/${id}`, { state: parameter_search });
  }

  // The deletion of a parameter search
  const handleDelete = async () => {
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
      setTimeout(() => setAlertDeleteVisible(false), 3000); // Wait 3 seconds
      setTimeout(() => window.location.reload(), 2000); // Reload after 2 seconds
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