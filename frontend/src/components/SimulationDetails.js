import { IoTrashSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, Alert, Popover, PopoverBody } from "reactstrap";

import '../styles/simulation_button.css'

const SimulationDetail = ({ simulation }) => {
  const history = useNavigate();
  const [alertDeleteVisible, setAlertDeleteVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(simulation.simulation_run_name);

  const handleAloneView = () => {
    const id = simulation._id;
    history(`/${id}/simulation`, { state: simulation });
  }

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  }

  const handleParamatersView = () => {
    const id = simulation._id;
    history(`/${id}/parameters`, { state: simulation });
  }

  const handleStimuliView = () => {
    const id = simulation._id;
    history(`/${id}/stimuli`, { state: simulation });
  }
  
  const handleExpProtocolsView = () => {
    const id = simulation._id;
    history(`/${id}/experimental-protocols`, { state: simulation });
  }

  const handleResultsView = () => {
    const id = simulation._id;
    history(`/${id}/results`, { state: simulation });
  }

  // Currently not used
  const handleDownload = async () => {
    try {
      const simulationsJson = JSON.stringify(simulation, null, 2);
      // Create a Blob containing the JSON data
      const blob = new Blob([simulationsJson], { type: 'application/json' });

      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'simulations.json';

      // Trigger the download
      document.body.appendChild(a);
      a.click();

      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = async () => {

    const response = await fetch('/simulation_runs/' + simulation._id, {
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

  const handleNameChange = async () => {
    try {
      const response = await fetch(`/simulation_runs/${simulation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ simulation_run_name: newName })
      });

      if (!response.ok) {
        throw new Error('Failed to update simulation name');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
    <Alert style={{ position: 'absolute', width: '100%' }} color="danger" isOpen={alertDeleteVisible} toggle={() => setAlertDeleteVisible(false)}>
      Simulation deleted!
    </Alert>
    <tr style={{ textAlign: 'center', verticalAlign: 'middle'}}>
      <td style={{ textAlign: 'center', padding: 0 }}>
        <Button className="icon-button" onClick={handleAloneView} >
          <IoEye size={28} className="icon"/>
        </Button>
      </td>
      <td>
        {new Date(simulation.createdAt).toLocaleString('en-GB')}
      </td>
      <td>
        {new Date(simulation.creation_data).toLocaleString('en-GB')}
      </td>
      <td>
          {editingName ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleNameChange}
              autoFocus
            />
          ) : (
            <span onClick={() => setEditingName(true)}>{simulation.simulation_run_name}</span>
          )}
        </td>
      <td>
        {simulation.model_name}
      </td>
      <td style={{ textAlign: 'center', padding: 0 }}>
        <Button id={`model_description_popover_${simulation._id}`} className="icon-button" type="button" onClick={togglePopover}>
          <IoEye size={28} className="icon" />
        </Button>
        <Popover trigger="legacy" placement="bottom" isOpen={popoverOpen} target={`model_description_popover_${simulation._id}`} toggle={togglePopover}>
          <PopoverBody>
            {simulation.model_description}
          </PopoverBody>
        </Popover>
      </td>
      <td style={{ textAlign: 'center', padding: 0 }}>
        <Button className="icon-button" onClick={handleParamatersView} >
          <IoEye size={28} className="icon"/>
        </Button>
      </td>
      <td style={{ textAlign: 'center', padding: 0 }}>
        <Button className="icon-button" onClick={handleStimuliView}>
          <IoEye size={28} className="icon" />
        </Button>
      </td>
      <td style={{ textAlign: 'center', padding: 0 }} >
        <Button className="icon-button" onClick={handleExpProtocolsView}>
          <IoEye size={28} className="icon" />
        </Button>
      </td>
      <td style={{ textAlign: 'center', padding: 0 }} >
        <Button className="icon-button" onClick={handleResultsView}>
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

export default SimulationDetail;