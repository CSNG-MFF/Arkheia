import { IoTrashSharp } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";

import React, { useState, useRef } from 'react'

import { Button, Alert, Popover, PopoverBody } from "reactstrap";

const SimulationDetail = ({ simulation }) => {
  const [alertDeleteVisible, setAlertDeleteVisible] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const data = {
      "name": "John Doe",
      "age": 30,
      "city": "New York",
      "isStudent": false,
      "hobbies": ["reading", "traveling", "coding"],
      "address": {
        "street": "123 Main St",
        "zipCode": "10001",
        "country": "USA"
      },
      "friends": [
        {
          "name": "Jane Smith",
          "age": 28,
          "isStudent": true
        },
        {
          "name": "Bob Johnson",
          "age": 32,
          "isStudent": false
        }
      ]
    }
  
  
  const handleDelete = async () => {
    const response = await fetch('/simulation_runs/' + simulation._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (!response.ok) {
      console.error(json.error);
    }

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
        <td>
          <Button id="popoverButton" type="button">
            Open Popover
          </Button>
          <Popover placement="bottom" isOpen={popoverOpen} target="popoverButton" toggle={togglePopover}>
            <PopoverBody>
              This is the content of my popover.
              
            </PopoverBody>
          </Popover>
        </td>
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