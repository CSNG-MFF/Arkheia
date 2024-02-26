import { IoTrashSharp } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, Alert, UncontrolledPopover, PopoverBody } from "reactstrap";

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
    history(`/${id}/stimuli`);
  }
  
  const handleExpProtocolsView = () => {
    const id = simulation._id;
    history(`/${id}/experimental-protocols`);
  }

  const handleResultsView = () => {
    const id = simulation._id;
    history(`/${id}/results`);
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
      console.log('simulation deleted');
      setAlertDeleteVisible(true);  // Show the alert
      setTimeout(() => setAlertDeleteVisible(false), 3000);
      setTimeout(() => window.location.reload(), 2000);
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
          <Button id="model_description_popover" type="button">
            <IoEye size={28} className="icon" />
          </Button>
          <UncontrolledPopover trigger="legacy" placement="bottom" isOpen={popoverOpen} target="model_description_popover" toggle={togglePopover}>
            <PopoverBody>
              {simulation.model_description}
            </PopoverBody>
          </UncontrolledPopover>
        </td>
        <td style={{ textAlign: 'center', padding: 0 }}>
          <Button id="icon-button" onClick={handleParamatersView} >
            <IoEye size={28} className="icon"/>
          </Button>
        </td>
        <td style={{ textAlign: 'center', padding: 0 }}>
          <Button id="icon-button" onClick={handleStimuliView}>
            <IoEye size={28} className="icon" />
          </Button>
        </td>
        <td style={{ textAlign: 'center', padding: 0 }} >
          <Button id="icon-button" onClick={handleExpProtocolsView}>
            <IoEye size={28} className="icon" />
          </Button>
        </td>
        <td style={{ textAlign: 'center', padding: 0 }} >
          <Button id="icon-button" onClick={handleResultsView}>
            <IoEye size={28} className="icon" />
          </Button>
        </td>
        <td style={{ textAlign: 'center', padding: 0 }} >
          <Button id="icon-button">
            <IoMdDownload size={28} className="icon" />
          </Button>  
        </td>  
        <td style={{ textAlign: 'center', padding: 0 }} >
          <Button id="icon-button" onClick={handleDelete}>
            <IoTrashSharp size={28} className="icon" />
          </Button>
        </td>
      </tr>
    </>
  )
}

export default SimulationDetail;