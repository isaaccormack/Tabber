import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from "react-router";

// TODO: redo UI design of these modals and probably just make a generic modal which you can pass the props to like image and text
export default function ReTabLickModal(props: any) {
    const history = useHistory();

    const lickName = props.lickName;
    const showModal = props.showModal;
    const handleCloseModal = props.handleCloseModal;

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Re-Tab {lickName}?</Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <div>The current tabs for this lick will no longer be accessible.</div>
                <div>Are you sure you want to Re-Tab?</div>
                <h1>Whoops, retabbing is not supported yet...</h1>
            </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Close
            </Button>
            {/* TODO: should probably redirect user to a retab page which is the same as the uploading page but it says re-tab */}
            {/* TODO: either the above, or just put spinning icon in modal and tell user we are retabbing */}
            <Button id="re-tab-button" variant="warning">
                Re-Tab
            </Button>
        </Modal.Footer>
        </Modal>

    )
}
