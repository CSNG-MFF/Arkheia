import { IoEye } from "react-icons/io5";

import React, { useState, useRef } from 'react'

import { Button, Popover, PopoverBody, Modal, ModalBody, ModalFooter } from "reactstrap";

import { JSONTree } from 'react-json-tree';

import '../styles/simulation_button.css'


const ResultByIdsTableBody = ({ result }) => {
  const [parameterModalOpen, setParameterModalOpen] = useState(false);
  const [captionPopoverOpen, setCaptionPopoverOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  const toggleParameterModalOpen = () => {
    setParameterModalOpen(!parameterModalOpen);
  };

  const toggleCaptionPopoverOpen = () => {
    setCaptionPopoverOpen(!captionPopoverOpen);
  }

  const toggleViewModal = () => {
    setViewModalOpen(!viewModalOpen);
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
          <ModalBody>
            <JSONTree
              hideRoot={true}
              labelRenderer={([key]) => <strong>{key}</strong>}
              invertTheme={true} 
              data={JSON.parse(result.parameters)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggleParameterModalOpen}>
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
          <IoEye size={28} className="icon" />
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
