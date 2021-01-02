import React from "react";
import { Button, Col, Container, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import LinkIcon from "../icons/link.svg";
import DetailsForm from "./DetailsForm";


// TODO: actually check if lick is made public and private s.t. user which is not owner cant see
export default function VisibilityForm(props: any) {
  const lickURL = window.location.host + "/view/" + props.lickId;

  const submitMakeLickPublic = (makePublic: boolean) => {
    fetch("/api/lick/" + props.lickId, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({makePublic})
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        props.setLick(responseJson);
      })
  }

  return (
    <Form onSubmit={(e: any) => e.preventDefault()}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridState" xs={3}>
          <Form.Label><h3>Visibility</h3></Form.Label>
          {props.isLickPublic ?
            <Button variant="danger" type="submit" onClick={() => submitMakeLickPublic(false)}>
              Make Private
            </Button>
            :
            <Button variant="success" type="submit" onClick={() => submitMakeLickPublic(true)}>
              Make Public
            </Button>
          }
        </Form.Group>

        <Form.Group id="lick-url-display" as={Col} controlId="formGridState" className="align-self-end" xs={9}>
          <InputGroup className="mb-3">
            <InputGroup.Prepend onClick={() => {
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
