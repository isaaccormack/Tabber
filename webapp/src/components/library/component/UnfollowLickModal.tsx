import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export interface UnfollowLickModalProps {
    selectedLickIDs: string[];
    showUnfollowModal: boolean;
    handleCloseUnfollowModal: () => void;
    handleUnfollowSelectedLicks: () => void;
}


// this component will actually have to make an API call to delete the lick IDs passed to it
export default function UnfollowLickModal(props: UnfollowLickModalProps) {
    const selectedLickIDs = props.selectedLickIDs;
    const showUnfollowModal = props.showUnfollowModal;
    const handleCloseUnfollowModal = props.handleCloseUnfollowModal;
    const handleUnfollowSelectedLicks = props.handleUnfollowSelectedLicks;

    const oneLickSelected = selectedLickIDs.length === 1;

    return (
        <Modal show={showUnfollowModal} onHide={handleCloseUnfollowModal}>
        <Modal.Header closeButton>
        {oneLickSelected ? 
            <Modal.Title>Unfollow the (1) selected lick?</Modal.Title>
            :
            <Modal.Title>Unfollow the ({selectedLickIDs.length}) selected licks?</Modal.Title>
        }
        </Modal.Header>
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseUnfollowModal}>
                Close
            </Button>
            <Button variant="danger" onClick={handleUnfollowSelectedLicks}>
                Delete
            </Button>
        </Modal.Footer>
        </Modal>

    )
}
