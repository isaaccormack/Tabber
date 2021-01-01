import React from "react";
import { Button, Col, Container, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import LinkIcon from "../icons/link.svg";


// TODO: actually check if lick is made public and private s.t. user which is not owner cant see
export default function VisibilityForm(props: any) {

  // TODO: make generic setLick function in parent which takes a fetch() and sets the lick based on the response
  //  this provides central error handling too
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
    <Form>
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
              // TODO: actually make this copy and add functionality ui display, cant copy if lick private
              navigator.clipboard.writeText("hello")}
            }>
              <InputGroup.Text style={{background: 'white'}}>
                <img src={LinkIcon} height={22} alt="link icon"/>
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              disabled={!props.isLickPublic}
              aria-label="lick url"
              value={window.location.host + "/view/" + props.lickId}/>
          </InputGroup>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
