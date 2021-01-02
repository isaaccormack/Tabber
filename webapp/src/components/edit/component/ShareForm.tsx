import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, FormControl, InputGroup, Row, Table } from "react-bootstrap";
import RemoveIcon from "../icons/remove.svg";
import { UserInterface } from "../../common/user/interface/UserInterface";
import { Simulate } from "react-dom/test-utils";

export default function ShareForm(props: any) {

  // TODO, use this somewhere
  const [userDoesntExistErr, setUserDoesntExistErr] = useState(false);
  const [shareWithEmail, setShareWithEmail] = useState("");

  // TODO: consolidate error handling
  const handleShare = () => {
    if (!shareWithEmail) return;

    fetch("/api/lick/share/" + props.lickId, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userEmail: shareWithEmail})
    })
      // should be a handle success response and handle fail
      .then((response) => {
        if (response.status !== 200) {
          setUserDoesntExistErr(true);
          throw Error('uh oh')
        }
        return response.json();
      })
      .then((responseJson) => {
        props.setAlert({msg: 'Lick shared with ' + shareWithEmail + '!', variant: 'success'})
        props.setLick(responseJson);
      })
      .catch((error) => {
        props.setAlert({msg: 'Lick could not be shared with ' + shareWithEmail, variant: 'danger'})
        props.incAlertQueue()
        console.log(error)
      })
      .finally(() => setShareWithEmail(""))
  }

  // TODO: endpoint should accept user email not id
  const handleUnShare = (userID: string | undefined, userEmail: string | undefined) => {

    // TODO: investigate why userId can be undefined? probably just in object initialization, in which case this is anti-pattern

    fetch("/api/lick/unshare/" + props.lickId, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({userID})
    })
      // should be a handle success response and handle fail
      .then((response) => {
        if (response.status !== 200) {
          throw Error('uh oh')
        }
        return response.json();
      })
      .then((responseJson) => {
        props.setAlert({msg: 'Lick has been unshared with ' + userEmail, variant: 'warning'})
        props.setLick(responseJson);
      })
      .catch((error) => console.log(error))
  }

  const renderTable = () => {
    return (
      props.sharedWith.slice().reverse().map((user: UserInterface) => {
        return (
          <Row key={user.id} style={{marginBottom: '10px'}}>
            <h6>
              {user.name} {' '}
              <span style={{color: 'grey'}}>{user.email}</span>
            </h6>
            <img
              className={'unshare-button'}
              style={{marginLeft: 'auto', marginRight: '10px'}}
              src={RemoveIcon}
              height={25}
              alt="unshare button"
              onClick={() => handleUnShare(user.id, user.email)}/>
          </Row>
        );
      })
    );
  };

  return (
    <>
      <Form onSubmit={(e: any) => {e.preventDefault(); handleShare()}}>
        <Form.Group>
          <Form.Label><h3>Share</h3></Form.Label>
          <InputGroup className="mb-3">
            <FormControl
              maxLength={100}
              placeholder="Enter users email address"
              aria-describedby="basic-addon2"
              value={shareWithEmail}
              onChange={(event => setShareWithEmail(event.target.value))}
            />
            <InputGroup.Append>
              <Button variant="success" onClick={handleShare}>Share</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
      <Container>
        {renderTable()}
      </Container>
    </>
  );
}
