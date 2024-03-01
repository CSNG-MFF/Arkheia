import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter } from "reactstrap";

import { JSONTree } from 'react-json-tree';

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
  console.log(stimuli.movie.data.toString('base64'));
  console.log(stimuli.movie);
  console.log("Szia Fanni");


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
        {stimuli.movie && (
          <img src={URL.createObjectURL(new Blob([stimuli.movie.data.data], { type: 'image/gif' }))} alt="gif" />
        )}
      </td>




    </tr>
    </>
  );
};

export default StimuliByIdsTableBody;
