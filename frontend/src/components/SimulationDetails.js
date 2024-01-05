import { IoTrashSharp } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import React, { useState, useRef } from 'react'

import { Button, Alert } from "reactstrap";

const SimulationDetail = ({ simulation }) => {
  const [alertDeleteVisible, setAlertDeleteVisible] = useState(false);

  const handleDelete = async () => {
    const response = await fetch('/simulation_runs/' + simulation._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      console.log('simulation deleted');
      setAlertDeleteVisible(true);  // Show the alert
      setTimeout(() => setAlertDeleteVisible(false), 3000);
    }
  }
  return (
    <>
    <tr className="simulation-detail" style={{ position: 'relative' }}>
        <td colSpan="11">
          <Alert style={{ position: 'absolute', width: '100%', zIndex: 1 }} color="danger" isOpen={alertDeleteVisible} toggle={() => setAlertDeleteVisible(false)}>
            Simulation deleted!
          </Alert>
        </td>
    </tr>
      <tr className="simulation-detail">
        <td>
          {new Date(simulation.createdAt).toLocaleString('en-GB')}
        </td>
        <td>
          {new Date(simulation.creation_data).toLocaleString('en-GB')}
        </td>
        <td>
          {simulation.simulation_run_name}
        </td>
        <td>
          {simulation.model_name}
        </td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>a</td>
        <td>
          <Button>
            <IoMdDownload/>
          </Button>  
        </td>  
        <td>
          <Button onClick={handleDelete}>
            <IoTrashSharp/>
          </Button>
        </td>
      </tr>
    </>
  )
}

export default SimulationDetail;