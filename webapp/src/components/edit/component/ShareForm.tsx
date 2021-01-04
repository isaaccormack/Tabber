import React, { useState } from "react";
import { Alert, Button, Col, Container, Form, FormControl, InputGroup, Row, Table } from "react-bootstrap";
import RemoveIcon from "../icons/remove.svg";
import { UserInterface } from "../../common/user/interface/UserInterface";
import { LickInterface } from "../../common/lick/interface/LickInterface";


// TODO: make share and unshare one function in front and back end and use email everwhere -> this will be a pain since
//  will need to update tests on backend
export default function ShareForm(props: any) {

  // TODO, use this somewhere
  const [userDoesntExistErr, setUserDoesntExistErr] = useState(false);
  const [shareWithEmail, setShareWithEmail] = useState("");

  // // TODO: consolidate error handling
  // const handleShare = () => {
  //   if (!shareWithEmail) return;
  //
  //   fetch("/api/lick/share/" + props.lickId, {
  //     method: "PUT",
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({userEmail: shareWithEmail})
  //   })
  //     // should be a handle success response and handle fail
  //     .then((response) => {
  //       if (response.status !== 200) {
  //         setUserDoesntExistErr(true);
  //         throw Error('uh oh')
  //       }
  //       return response.json();
  //     })
  //     .then((responseJson) => {
  //       props.setAlert({msg: 'Lick shared with ' + shareWithEmail + '!', variant: 'success'})
  //       props.setLick(responseJson);
  //     })
  //     .catch((error) => {
  //       props.setAlert({msg: 'Lick could not be shared with ' + shareWithEmail, variant: 'danger'})
  //       console.log(error)
  //     })
  //     .finally(() => setShareWithEmail(""))
  // }

  // TODO: endpoint should accept user email not id
  const handleUpdateLickSharedWith = (userEmail: string, share: boolean) => {
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
      throw new Error('Cannot (un)share this lick: ' + response.status + ' (' + response.statusText + ')');
    })
    .then((responseJson: LickInterface) => {
      if (share) {
        props.setAlert({msg: 'Lick has been shared with ' + userEmail, variant: 'success'})
      } else {
        props.setAlert({msg: 'Lick has been unshared with ' + userEmail, variant: 'warning'})
      }
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
              onClick={() => handleUpdateLickSharedWith(user.email || "", false)}/>
          </Row>
        );
      })
    );
  };

  return (
    <>
      <Form onSubmit={(e: any) => {e.preventDefault(); handleUpdateLickSharedWith(shareWithEmail, true)}}>
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
              {/* change to !sharedWithEmail*/}
              <Button type="submit" variant={"success"} disabled={shareWithEmail === ""}> Share</Button>
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
