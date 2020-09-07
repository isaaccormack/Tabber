import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export interface DeleteLickModalProps {
    selectedLickIDs: string[];
    showDeleteModal: boolean;
    handleCloseDeleteModal: () => void;
    handleDeleteSelectedLicks: () => void;
}


// this component will actually have to make an API call to delete the lick IDs passed to it
export default function DeleteLickModal(props: DeleteLickModalProps) {
    const selectedLickIDs = props.selectedLickIDs;
    const showDeleteModal = props.showDeleteModal;
    const handleCloseDeleteModal = props.handleCloseDeleteModal;
    const handleDeleteSelectedLicks = props.handleDeleteSelectedLicks;

    const oneLickSelected = selectedLickIDs.length === 1;

    return (
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
        {oneLickSelected ? 
            <Modal.Title>Delete the (1) selected lick?</Modal.Title>
            :
            <Modal.Title>Delete the ({selectedLickIDs.length}) selected licks?</Modal.Title>
        }
        </Modal.Header>
        {oneLickSelected ?
            <Modal.Body>This lick will be permanently deleted. Are you sure?</Modal.Body>
            :
            <Modal.Body>These licks will be permanently deleted. Are you sure?</Modal.Body>
        }
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>
                Close
            </Button>
            <Button variant="danger" onClick={handleDeleteSelectedLicks}>
                Delete
            </Button>
        </Modal.Footer>
        </Modal>

    )
}
