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


const ResultByIdsTableBody = ({ result }) => {
  
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(Array(result.length).fill(false));
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(Array(result.length).fill(false));
  const [viewPopoverOpen, setViewPopoverOpen] = useState(Array(result.length).fill(false));
  
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

  const toggleViewPopover = (index) => {
    const newPopoverState = [...longDescriptionPopoverOpen];
    newPopoverState[index] = !newPopoverState[index];
    setViewPopoverOpen(newPopoverState);
  }


  return (
    <>
    <tr>
      <td>
        {result.code_name}
      </td>
      <td>
        {result.name}
      </td>
      <td>
        <Button
          id={`model_description_popover_${result._id}`} // Unique id for each popover
          type="button"
          onClick={() => toggleLongDescriptionPopover(result._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopoverOpen[result._id]} // Use popover state based on index
          target={`model_description_popover_${result._id}`} // Target each popover with the unique id
          toggle={() => toggleLongDescriptionPopover(result._id)} // Pass index to togglePopover function
        >
          <PopoverBody>
            {result.parameters}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
      <td>
        <Button
          type="button"
          onClick={() => toggleParameterPopover(result._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterPopoverOpen[result._id]} // Use popover state based on index
          toggle={() => toggleParameterPopover(result._id)} // Pass index to togglePopover function
        >
          <ModalBody>
            <JSONTree data={result.caption} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => toggleParameterPopover(result._id)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </td>
      <td>
      <Button
          type="button"
          onClick={() => toggleViewPopover(result._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={viewPopoverOpen[result._id]} // Use popover state based on index
          toggle={() => toggleViewPopover(result._id)} // Pass index to togglePopover function
        >
          <ModalBody>
              {result.figure && result.figure.data ? (
              <img
                src={`data:${result.figure.contentType};base64,${uint8ToBase64(result.figure.data.data)}`}
                alt="Result Figure"
                style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }}
              />
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => toggleViewPopover(result._id)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
        
      </td>
    </tr>
    </>
  );
};

export default ResultByIdsTableBody;
