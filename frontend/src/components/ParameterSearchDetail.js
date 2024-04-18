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
    //TODO
  }
  const handleDelete = async () => {

  }
  return (
    <>
    <Alert style={{ position: 'absolute', width: '100%' }} color="danger" isOpen={alertDeleteVisible} toggle={() => setAlertDeleteVisible(false)}>
      Parameter Search deleted!
    </Alert>
    <tr>
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