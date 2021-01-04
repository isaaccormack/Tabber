import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Row } from "react-bootstrap";
import RedoIcon from "../icons/redo.svg";

export default function ReTabLickModal(props: any) {

  const showModal = props.showModal;
  const handleCloseModal = props.handleCloseModal;

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton style={{border: 'none', paddingBottom: '0px'}}>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-md-center" style={{marginBottom: '20px'}}>
          <img
            src={RedoIcon}
            height={120}
            alt="re-tab lick"
          />
        </Row>
        <Row className="justify-content-md-center">
          <h5>Are you sure?</h5>
        </Row>
        <Row className="justify-content-md-center">
            The current tabs for this lick will no longer be accessible
        </Row>
        <Row className="justify-content-md-center" style={{marginTop: '20px'}}>
          <Button variant="outline-secondary" onClick={handleCloseModal} style={{marginRight: '50px'}}>
            Cancel
          </Button>
          <Button
            style={{color: 'white'}}
            variant="warning"
            onClick={() => props.reTabLick()}
          >
            Re-Tab
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
