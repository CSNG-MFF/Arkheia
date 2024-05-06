import { IoEye } from "react-icons/io5";

import React, { useState } from 'react'

import { Button, UncontrolledPopover, PopoverBody, Modal, ModalBody, ModalFooter, ModalHeader, List } from "reactstrap";

import { JSONTree } from 'react-json-tree';

import '../styles/simulation_button.css'

const RecordByIdsTableBody = ({ record }) => {
  
  // Controls visibility of the long description popover
  const [longDescriptionPopoverOpen, setLongDescriptionPopoverOpen] = useState(false); 

  // Controls the visibility of the parameter modal
  const [parameterModalOpen, setParameterModalOpen] = useState(false);

  // The popover for the long description
  const toggleLongDescriptionPopover = () => {
    setLongDescriptionPopoverOpen(!longDescriptionPopoverOpen);
  };

  // The modal for the parameters
  const toggleParameterModal = () => {
    setParameterModalOpen(!parameterModalOpen);
  }


  return (
    <>
    <tr style={{ textAlign: 'center', verticalAlign: 'middle'}}>
      <td>
        {record.code_name}
      </td>
      <td>
        {record.source}
      </td>
      <td style={{ textAlign: 'start'}}>
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
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`model_description_popover_${record._id}`} // Unique id for each popover
          type="button"
          onClick={toggleLongDescriptionPopover}
        >
          <IoEye size={28} className="icon" />
        </Button>
        <UncontrolledPopover
          trigger="legacy"
          placement="bottom"
          isOpen={longDescriptionPopoverOpen}
          target={`model_description_popover_${record._id}`} // Target each popover with the unique id
          toggle={toggleLongDescriptionPopover}
        >
          <PopoverBody>
            {record.long_description}
          </PopoverBody>
        </UncontrolledPopover>
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`parameter_${record._id}`}
          type="button"
          onClick={toggleParameterModal} 
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterModalOpen}
          toggle={toggleParameterModal}
          target={`parameter_${record._id}`}
        >
          <ModalHeader style={{ backgroundColor: 'rgb(0, 43, 54)', textAlign: 'center' }}>
            <h1 style={{ textAlign: 'center', color: 'white'}}> Parameters </h1>
          </ModalHeader>
          <ModalBody style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <JSONTree 
              hideRoot={true}
              labelRenderer={([key]) => <strong>{key}</strong>}
              invertTheme={true}
              data={record.parameters} 
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

export default RecordByIdsTableBody;
