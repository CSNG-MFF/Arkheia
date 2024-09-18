import { IoEye } from "react-icons/io5";

import React, { useState } from 'react'

import { Button, Popover, PopoverBody, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { JSONTree } from 'react-json-tree';

import '../styles/simulation_button.css'

/**
 * 
 * @param param0 The stimuli to be used inside the table 
 * @returns The table with the stimuli
 */
const StimuliByIdsTableBody = ({ stimuli }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  // Controls the visibility of the long description popover
  const [longDescriptionPopOver, setLongDescriptionPopOver] = useState(false);

  // Controls the visibility of the parameter modal
  const [parameterModalOpen, setParameterModalOpen] = useState(false);


  // Toggles the long description popover
  const togglePopover = () => {
    setLongDescriptionPopOver(!longDescriptionPopOver);
  }

  // Toggles the parameter modal
  const toggleParameterModalOpen = () => {
    setParameterModalOpen(!parameterModalOpen);
  }

  return (
    <>
    <tr style={{ textAlign: 'center', verticalAlign: 'middle'}}>
      <td>
        {stimuli.code_name}
      </td>
      <td>
        {stimuli.short_description}
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`popover_${stimuli._id}`} // Unique id for each popover
          type="button"
          onClick={togglePopover}
        >
          <IoEye size={28} className="icon"/>
        </Button>
        <Popover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopOver}
          target={`popover_${stimuli._id}`} // Target each popover with the unique id
          toggle={togglePopover}
        >
          <PopoverBody>
            {stimuli.long_description}
          </PopoverBody>
        </Popover>
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`modal_${stimuli._id}`}
          type="button"
          onClick={toggleParameterModalOpen}
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal 
          isOpen={parameterModalOpen}
          target={`modal_${stimuli._id}`}
          toggle={toggleParameterModalOpen}
        >
          <ModalHeader style={{ backgroundColor: 'rgb(0, 43, 54)', textAlign: 'center' }}>
            <h1 style={{ textAlign: 'center', color: 'white'}}> Parameters </h1>
          </ModalHeader>
          <ModalBody style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <JSONTree 
              data={JSON.parse(stimuli.parameters)} 
              hideRoot={true}
              labelRenderer={([key]) => <strong>{key}</strong>}
              invertTheme={true}
            />
          </ModalBody>
          <ModalFooter style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <Button color="warning" onClick={toggleParameterModalOpen}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </td>
      <td>
          <img
            src={`${apiUrl}/stimuli/${stimuli._id}/image`} 
            alt="Stimuli"
          />
      </td>
    </tr>
    </>
  );
};

export default StimuliByIdsTableBody;
