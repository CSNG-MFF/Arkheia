import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter } from "reactstrap";

import { JSONTree } from 'react-json-tree';

const ExpProtocolByIdsTableBody = ({ expProtocol }) => {
  
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(Array(expProtocol.length).fill(false));
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(Array(expProtocol.length).fill(false));

  const toggleLongDescriptionPopover = (index) => {
    const newPopoverState = [...longDescriptionPopoverOpen];
    newPopoverState[index] = !newPopoverState[index];
    setLongDescriptionPopoverOpen(newPopoverState);
  };

  const toggleParameterPopover = (index) => {
    const newPopoverState = [...longDescriptionPopoverOpen];
    newPopoverState[index] = !newPopoverState[index];
    setParameterPopoverOpen(newPopoverState);
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
      <td>
        <Button
          id={`model_description_popover_${expProtocol._id}`} // Unique id for each popover
          type="button"
          onClick={() => toggleLongDescriptionPopover(expProtocol._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopoverOpen[expProtocol._id]} // Use popover state based on index
          target={`model_description_popover_${expProtocol._id}`} // Target each popover with the unique id
          toggle={() => toggleLongDescriptionPopover(expProtocol._id)} // Pass index to togglePopover function
        >
          <PopoverBody>
            {expProtocol.long_description}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
      <td>
        <Button
          type="button"
          onClick={() => toggleParameterPopover(expProtocol._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterPopoverOpen[expProtocol._id]} // Use popover state based on index
          toggle={() => toggleParameterPopover(expProtocol._id)} // Pass index to togglePopover function
        >
          <ModalBody>
            <JSONTree data={expProtocol.parameters} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => toggleParameterPopover(expProtocol._id)}>
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
