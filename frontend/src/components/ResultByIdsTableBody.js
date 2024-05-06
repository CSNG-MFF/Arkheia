import { IoEye } from "react-icons/io5";

import React, { useState } from 'react'

import { Button, Popover, PopoverBody, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { JSONTree } from 'react-json-tree';

import '../styles/simulation_button.css'


const ResultByIdsTableBody = ({ result }) => {
  // Controls the visibility of the parameter modal
  const [parameterModalOpen, setParameterModalOpen] = useState(false);

  // Controls the visibility of the caption popover
  const [captionPopoverOpen, setCaptionPopoverOpen] = useState(false);

  // Controls the visibility of the figure modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  // The modal for the parameters
  const toggleParameterModalOpen = () => {
    setParameterModalOpen(!parameterModalOpen);
  };

  // The popover for the caption
  const toggleCaptionPopoverOpen = () => {
    setCaptionPopoverOpen(!captionPopoverOpen);
  }

  // The modal for the figures
  const toggleViewModal = () => {
    setViewModalOpen(!viewModalOpen);
  }


  return (
    <>
    <tr style={{ textAlign: 'center', verticalAlign: 'middle'}}>
      <td>
        {result.code_name}
      </td>
      <td>
        {result.name}
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`modal_${result._id}`} // Unique id for each modal
          type="button"
          onClick={toggleParameterModalOpen}
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Modal
          isOpen={parameterModalOpen} // Use popover state based on index
          target={`modal_${result._id}`} // Target each popover with the unique id
          toggle={toggleParameterModalOpen} 
        >
          <ModalHeader style={{ backgroundColor: 'rgb(0, 43, 54)', textAlign: 'center' }}>
            <h1 style={{ textAlign: 'center', color: 'white'}}> Parameters </h1>
          </ModalHeader>
          <ModalBody style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <JSONTree
              hideRoot={true}
              labelRenderer={([key]) => <strong>{key}</strong>}
              invertTheme={true} 
              data={JSON.parse(result.parameters)}
            />
          </ModalBody>
          <ModalFooter style={{ backgroundColor: 'rgb(0, 43, 54)' }}>
            <Button color="warning" onClick={toggleParameterModalOpen}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`caption_${result._id}`}
          type="button"
          onClick={toggleCaptionPopoverOpen} 
        >
          <IoEye size={28} className="icon" />
        </Button>
        <Popover
          trigger="legacy"
          placement="bottom"
          target={`caption_${result._id}`}
          isOpen={captionPopoverOpen}
          toggle={toggleCaptionPopoverOpen}
        >
          <PopoverBody>
            {result.caption}
          </PopoverBody>
        </Popover>
      </td>
      <td style={{ textAlign: 'center'}}>
        <Button
          className="icon-button"
          id={`view_${result._id}`}
          type="button"
          onClick={toggleViewModal}
        >
          <img
            src={`/results/${result._id}/image`} 
            alt="Result Figure"
            style={{ maxWidth: '70%', maxHeight: '50%', height: 'auto' }}
          />
        </Button>
        <Modal
          target={`view_${result._id}`}
          isOpen={viewModalOpen}
          toggle={toggleViewModal}
          style={{ maxWidth: '90%', maxHeight: '90%', height: 'auto' }}
        >
          <ModalBody>
            <img
              src={`/results/${result._id}/image`} 
              alt="Result Figure"
              style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto' }}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleViewModal}>
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
