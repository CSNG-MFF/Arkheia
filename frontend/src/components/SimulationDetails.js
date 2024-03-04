import { IoTrashSharp } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, Alert, Popover, PopoverBody } from "reactstrap";

import '../styles/simulation_button.css'

const SimulationDetail = ({ simulation }) => {
  const history = useNavigate();
  const [alertDeleteVisible, setAlertDeleteVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  }

  const handleParamatersView = () => {
    const id = simulation._id;
    history(`/${id}/parameters`);
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
  
  const handleDelete = async () => {

    const response = await fetch('/simulation_runs/' + simulation._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (!response.ok) {
      console.error(json.error);
      window.location.reload();
    }

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

    if (response.ok) {
      console.log('simulation deleted');
      setAlertDeleteVisible(true);  // Show the alert
      setTimeout(() => setAlertDeleteVisible(false), 3000);
      setTimeout(() => window.location.reload(), 2000);
    }
  }
  return (
    <>
    <Alert style={{ position: 'absolute', width: '93%' }} color="danger" isOpen={alertDeleteVisible} toggle={() => setAlertDeleteVisible(false)}>
      Simulation deleted!
    </Alert>
    <tr>
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
        <Button className="icon-button">
          <IoMdDownload size={28} className="icon" />
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