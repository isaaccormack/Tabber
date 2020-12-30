import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export interface ShareLickModalProps {
    selectedLickIDs: string[];
    showShareModal: boolean;
    handleCloseShareModal: () => void;
    handleShareSelectedLicks: () => void;
}


// this component will actually have to make an API call to delete the lick IDs passed to it
export default function DeleteLickModal(props: ShareLickModalProps) {
    const selectedLickIDs = props.selectedLickIDs;
    const showShareModal = props.showShareModal;
    const handleCloseShareModal = props.handleCloseShareModal;
    const handleShareSelectedLicks = props.handleShareSelectedLicks;

    const oneLickSelected = selectedLickIDs.length === 1;

    return (
        <Modal show={showShareModal} onHide={handleCloseShareModal}>
        <Modal.Header closeButton>
        {oneLickSelected ? 
            <Modal.Title>Share the (1) selected lick?</Modal.Title>
            :
            <Modal.Title>Share the ({selectedLickIDs.length}) selected licks?</Modal.Title>
        }
        </Modal.Header>
        <Modal.Body>This is a placeholder.</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseShareModal}>
                Close
            </Button>
            <Button variant="success" onClick={handleShareSelectedLicks}>
                Share
            </Button>
        </Modal.Footer>
        </Modal>

    )
}
