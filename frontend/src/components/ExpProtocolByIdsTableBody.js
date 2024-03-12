import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter } from "reactstrap";

import { JSONTree } from 'react-json-tree';

import '../styles/simulation_button.css'

const ExpProtocolByIdsTableBody = ({ expProtocol }) => {
  
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(false);
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(false);

  const toggleLongDescriptionPopover = () => {
    setLongDescriptionPopoverOpen(!longDescriptionPopoverOpen);
  };

  const toggleParameterPopover = () => {
    setParameterPopoverOpen(!parameterPopoverOpen);
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
          onClick={toggleParameterPopover} 
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterPopoverOpen}
          toggle={toggleParameterPopover}
          target={`parameter_${expProtocol._id}`}
        >
          <ModalBody>
            <JSONTree 
              hideRoot={true}
              labelRenderer={([key]) => <strong>{key}</strong>}
              invertTheme={true}
              data={expProtocol.parameters} 
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleParameterPopover}>
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