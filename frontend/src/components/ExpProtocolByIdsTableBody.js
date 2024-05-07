import { IoEye } from "react-icons/io5";

import React, { useState } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { JSONTree } from 'react-json-tree';

import '../styles/simulation_button.css'

/**
 * 
 * @param param0 The experimental protocol to be shown 
 * @returns The table body for the experimental protocols
 */
const ExpProtocolByIdsTableBody = ({ expProtocol }) => {
  
   // Controls the visibility of the long description popover
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(false);

   // Controls the visibility of the parameter modal
  const [parameterModalOpen, setParameterModalOpen] = useState(false);

  // The popover for the long description
  const toggleLongDescriptionPopover = () => {
    setLongDescriptionPopoverOpen(!longDescriptionPopoverOpen);
  };

  // The modal for the parameter
  const toggleParameterModal = () => {
    setParameterModalOpen(!parameterModalOpen);
  }

  return (
    <>
    <tr>
      <td>
        {expProtocol.code_name}
      </td>
      <td>
        {expProtocol.short_description}
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`model_description_popover_${expProtocol._id}`} // Unique id for each popover
          type="button"
          onClick={toggleLongDescriptionPopover}
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopoverOpen}
          target={`model_description_popover_${expProtocol._id}`} // Target each popover with the unique id
          toggle={toggleLongDescriptionPopover}
        >
          <PopoverBody>
            {expProtocol.long_description}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`parameter_${expProtocol._id}`}
          type="button"
          onClick={toggleParameterModal} 
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterModalOpen}
          toggle={toggleParameterModal}
          target={`parameter_${expProtocol._id}`}
        >
          <ModalHeader style={{ backgroundColor: 'rgb(0, 43, 54)', textAlign: 'center' }}>
            <h1 style={{ textAlign: 'center', color: 'white'}}> Parameters </h1>
          </ModalHeader>
          <ModalBody style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <JSONTree 
              hideRoot={true}
              labelRenderer={([key]) => <strong>{key}</strong>}
              invertTheme={true}
              data={expProtocol.parameters} 
            />
          </ModalBody>
          <ModalFooter style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <Button color="warning" onClick={toggleParameterModal}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </td>
    </tr>
    </>
  );
};

export default ExpProtocolByIdsTableBody;
