import React from "react";
import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import LinkIcon from "../../icons/link.svg";
import { LickInterface } from "../../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../../common/utils/formattingHelpers";

// TODO: actually check if lick is made public and private s.t. user which is not owner cant see
export default function VisibilityForm(props: any) {

  const lickURL = window.location.host + "/view/" + props.lickId;

  const updateVisibility = (makePublic: boolean) => {
    fetch("/api/lick/" + props.lickId, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ makePublic })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Lick visibility could not be updated', response.status, response.statusText);
    })
    .then((responseJson: LickInterface) => {
      props.setLick(responseJson);
    })
    .catch((err: Error) => {
      props.setAlert({msg: err.message, variant: 'danger'})
    })
  }

  return (
    <Form onSubmit={(e: any) => e.preventDefault()}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridState" xs={3}>
          <Form.Label><h3>Visibility</h3></Form.Label>
          {props.isLickPublic ?
            <Button variant="danger" type="submit" onClick={() => updateVisibility(false)}>
              Make Private
            </Button>
            :
            <Button variant="success" type="submit" onClick={() => updateVisibility(true)}>
              Make Public
            </Button>
          }
        </Form.Group>

        <Form.Group style={{marginBottom: '0px'}} as={Col} controlId="formGridState" className="align-self-end" xs={9}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend
              onClick={() => {
              navigator.clipboard.writeText(lickURL);
              props.setAlert({msg: 'Lick URL copied to clipboard!', variant: 'success'});
            }}>
              <InputGroup.Text style={{background: 'white', cursor: 'pointer'}}>
                <img src={LinkIcon} height={22} alt="link icon"/>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              disabled={!props.isLickPublic}
              aria-label="lick url"
              value={lickURL}/>
          </InputGroup>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
