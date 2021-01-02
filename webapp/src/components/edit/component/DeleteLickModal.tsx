import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from "react-router";

export interface DeleteLickModalProps {
    lickName: string | undefined;
    showModal: boolean;
    handleCloseModal: () => void;
}

// TODO: update the UI to match moqups
// this component will actually have to make an API call to delete the lick IDs passed to it
export default function DeleteLickModal(props: DeleteLickModalProps) {
    const history = useHistory();

    const lickName = props.lickName;
    const showModal = props.showModal;
    const handleCloseModal = props.handleCloseModal;

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
            <Modal.Title>Delete {lickName}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This lick will be permanently deleted. Are you sure?</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
                Close
            </Button>
            {/* TODO: actually delete lick via API call */}
            {/* TODO: this should show a dropdown when /library is rendered telling user lick was deleted */}
            <Button variant="danger" onClick={() => history.push("/library")}>
                Delete
            </Button>
        </Modal.Footer>
        </Modal>

    )
}
