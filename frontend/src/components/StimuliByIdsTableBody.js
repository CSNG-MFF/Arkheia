import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, UncontrolledPopover, PopoverBody } from "reactstrap";


const StimuliByIdsTableBody = ({ stimuli }) => {
  const [popoverOpen, setPopoverOpen] = useState(Array(stimuli.length).fill(false));

  const togglePopover = (index) => {
    const newPopoverState = [...popoverOpen];
    newPopoverState[index] = !newPopoverState[index];
    setPopoverOpen(newPopoverState);
  };

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
          onClick={() => togglePopover(stimuli._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={popoverOpen[stimuli._id]} // Use popover state based on index
          target={`model_description_popover_${stimuli._id}`} // Target each popover with the unique id
          toggle={() => togglePopover(stimuli._id)} // Pass index to togglePopover function
        >
          <PopoverBody>
            {stimuli.long_description}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
    </tr>
    </>
  );
};

export default StimuliByIdsTableBody;
