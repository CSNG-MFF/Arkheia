import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter } from "reactstrap";

import { JSONTree } from 'react-json-tree';

function uint8ToBase64(uint8Array) {
  let binary = '';
  uint8Array.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}


const StimuliByIdsTableBody = ({ stimuli }) => {
  
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(Array(stimuli.length).fill(false));
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(Array(stimuli.length).fill(false));

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
  console.log(stimuli.movie.data);


  return (
    <>
    <tr>
      <td>
        {stimuli.code_name}
      </td>
      <td>
        {stimuli.short_description}
      </td>
      <td>
        <Button
          id={`model_description_popover_${stimuli._id}`} // Unique id for each popover
          type="button"
          onClick={() => toggleLongDescriptionPopover(stimuli._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopoverOpen[stimuli._id]} // Use popover state based on index
          target={`model_description_popover_${stimuli._id}`} // Target each popover with the unique id
          toggle={() => toggleLongDescriptionPopover(stimuli._id)} // Pass index to togglePopover function
        >
          <PopoverBody>
            {stimuli.long_description}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
      <td>
        <Button
          type="button"
          onClick={() => toggleParameterPopover(stimuli._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterPopoverOpen[stimuli._id]} // Use popover state based on index
          toggle={() => toggleParameterPopover(stimuli._id)} // Pass index to togglePopover function
        >
          <ModalBody>
            <JSONTree data={stimuli.parameters} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => toggleParameterPopover(stimuli._id)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </td>
      <td>
        {stimuli.movie && stimuli.movie.data ? (
          <img
            src={`data:${stimuli.movie.contentType};base64,${uint8ToBase64(stimuli.movie.data.data)}`}
            alt="Stimuli"
          />
        ) : null}
      </td>
    </tr>
    </>
  );
};

export default StimuliByIdsTableBody;
