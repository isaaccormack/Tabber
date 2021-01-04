import React, { useState } from "react";
import { Button, Container, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import RemoveIcon from "../icons/remove.svg";
import { UserInterface } from "../../common/user/interface/UserInterface";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../common/utils/utils";

export default function ShareForm(props: any) {

  const [shareWithEmail, setShareWithEmail] = useState("");

  const updateLickSharedWith = (userEmail: string, share: boolean) => {
    if (share && !userEmail) return;

    fetch("/api/lick/update-shared-with/" + props.lickId, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, share })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 412) {
        throw new Error('Cannot share lick with: ' + userEmail + ' (User not found)')
      } else if (response.status === 418) {
        throw new Error('Cannot share lick with yourself')
      }
      throwFormattedError('Cannot (un)share this lick', response.status, response.statusText);
    })
    .then((responseJson: LickInterface) => {
      if (share) {
        props.setAlert({msg: 'Lick has been shared with ' + userEmail, variant: 'success'})
      } else {
        props.setAlert({msg: 'Lick has been unshared with ' + userEmail, variant: 'warning'})
      }
      setShareWithEmail("");
      props.setLick(responseJson);
    })
    .catch((err: Error) => {
      props.setAlert({msg: err.message, variant: 'danger'})
    })
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
              onClick={() => updateLickSharedWith(user.email || "", false)}/>
          </Row>
        );
      })
    );
  };

  return (
    <>
      <Form onSubmit={(e: any) => {e.preventDefault(); updateLickSharedWith(shareWithEmail, true)}}>
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
              <Button type="submit" variant={"success"} disabled={!shareWithEmail}> Share</Button>
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
