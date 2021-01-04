import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { LickInterface } from "../../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../../common/utils/formattingHelpers";

export default function DetailsForm(props: any) {

  const [name, setName] = useState<string>(props.lickName);
  const [desc, setDesc] = useState<string>(props.lickDesc);

  const updateDetails = () => {
    fetch("/api/lick/" + props.lickId, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, desc })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Details could not be saved', response.status, response.statusText);
    })
    .then((responseJson: LickInterface) => {
      props.setAlert({msg: 'Details saved!', variant: 'success'})
      props.setLick(responseJson);
    })
    .catch((err: Error) => {
      props.setAlert({msg: err.message, variant: 'danger'})
    })
  }

  const renderSaveDetailsButton = () => {
    const detailsUpdated = !((name === props.lickName) && (desc === props.lickDesc) || (name === ""));

    return (
      <Button type="submit" variant={"success"} disabled={!detailsUpdated}>
        Save Details
      </Button>
    );
  }

  return (
    <Form onSubmit={(e: any) => {e.preventDefault(); updateDetails()}}>
      <Form.Row style={{marginBottom: '0px'}}>
        <Col xs={8}>
          <Form.Group>
            <Form.Label>
              <h3>Details</h3>
            </Form.Label>
            <Form.Control
              type="text"
              maxLength={100}
              value={name}
              placeholder="Title"
              onChange={(event => setName(event.target.value))}
            />
          </Form.Group>
        </Col>
        {/* TODO: fix styling here */}
        <Col className="align-self-end ml-auto"  style={{paddingBottom: '16px'}} xs={4}>
          {renderSaveDetailsButton()}
        </Col>
      </Form.Row>
      <Form.Row style={{marginTop: '0px', marginBottom: '0px'}}>
        <Col>
          <Form.Group>
            <Form.Control
              style={{height: '100px', resize: 'none', overflowY: "hidden"}}
              type="text"
              as={"textarea"}
              maxLength={250}
              value={desc}
              placeholder="Description"
              onChange={(event => setDesc(event.target.value))}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    </Form>
  );
}
