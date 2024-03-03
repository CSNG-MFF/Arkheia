import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter, List } from "reactstrap";

import { JSONTree } from 'react-json-tree';

const RecordByIdsTableBody = ({ record }) => {
  
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(Array(record.length).fill(false));
  const [parameterPopoverOpen, setParameterPopoverOpen] = useState(Array(record.length).fill(false));

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
        {record.code_name}
      </td>
      <td>
        {record.source}
      </td>
      <td>
        {Array.isArray(record.variables) ? (
            <List>
              {record.variables.map((variable, index) => (
                <li key={index}>
                  {variable}
                </li>
              ))}
            </List>
          ) : (
            <List>
              <li>
                {record.variables}
              </li>
            </List>
          )}
      </td>
      <td>
        {record.short_description}
      </td>
      <td>
        <Button
          id={`model_description_popover_${record._id}`} // Unique id for each popover
          type="button"
          onClick={() => toggleLongDescriptionPopover(record._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopoverOpen[record._id]} // Use popover state based on index
          target={`model_description_popover_${record._id}`} // Target each popover with the unique id
          toggle={() => toggleLongDescriptionPopover(record._id)} // Pass index to togglePopover function
        >
          <PopoverBody>
            {record.long_description}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
      <td>
        <Button
          type="button"
          onClick={() => toggleParameterPopover(record._id)} // Pass index to togglePopover function
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterPopoverOpen[record._id]} // Use popover state based on index
          toggle={() => toggleParameterPopover(record._id)} // Pass index to togglePopover function
        >
          <ModalBody>
            <JSONTree data={record.parameters} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => toggleParameterPopover(record._id)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </td>
    </tr>
    </>
  );
};

export default RecordByIdsTableBody;
