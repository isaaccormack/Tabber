import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from "react-router";
import { Row } from "react-bootstrap";
import RemoveIcon from "../icons/remove.svg";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../common/utils/utils";

export default function UnfollowLickModal(props: any) {
  const history = useHistory();

  const showModal = props.showModal;
  const handleCloseModal = props.handleCloseModal;

  const unfollowLick = () => {
    fetch("/api/lick/unfollow/" + props.lickId, {
      method: "PUT"
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Lick could not be unfollowed', response.status, response.statusText);
    })
    .then((responseJson: LickInterface) => {
      history.push({
        pathname: '/shared',
        state: { from: 'unfollow', lickName: responseJson.name }
      });
    })
    .catch((err: Error) => {
      handleCloseModal();
      props.setAlert({msg: err.message, variant: 'danger'})
    })
  }

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton style={{border: 'none', paddingBottom: '0px'}}>
      </Modal.Header>
      <Modal.Body>
      <Row className="justify-content-md-center" style={{marginBottom: '20px'}}>
        <img
          src={RemoveIcon}
          height={120}
          alt="unfollow lick icon"
        />
      </Row>
        <Row className="justify-content-md-center">
          <h5>Are you sure?</h5>
        </Row>
        <Row className="justify-content-md-center">
          You will no longer have access to this lick
        </Row>
        <Row className="justify-content-md-center" style={{marginTop: '20px'}}>
          <Button variant="outline-secondary" onClick={handleCloseModal} style={{marginRight: '50px'}}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => unfollowLick()}>
            Unfollow
          </Button>
        </Row>
      </Modal.Body>
    </Modal>
  )
}
