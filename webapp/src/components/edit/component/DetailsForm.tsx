import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useHistory } from "react-router";
import { LickInterface } from "../../common/lick/interface/LickInterface";

export default function DetailsForm(props: any) {
  const [title, setTitle] = useState<string>(props.lickName);
  const [desc, setDesc] = useState<string>(props.lickDesc);

  const updateDetails = (newLickName: string, newLickDesc: string) => {
    fetch("/api/lick/" + props.lickId, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newName: newLickName,
        newDescription: newLickDesc
      })
    })
    // TODO: set alert that says cant update lick for some reason, ie. bad req, server error (maybe?)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Couldnt update lick');
      }
    })
    .then((responseJson) => {
      props.setAlert({msg: 'Details saved!', variant: 'success'})
      props.setLick(responseJson);
    })
  }

  const renderSaveDetailsButton = () => {
    const detailsUpdated = !((title === props.lickName) && (desc === props.lickDesc) || (title === ""));
    return (
      <Button
        // variant={detailsUpdated ? "success" : "secondary"}
        variant={"success"}
        type="submit"
        disabled={!detailsUpdated}>
        Save Details
      </Button>
    );
  }

  return (
    <Form onSubmit={(e: any) => {e.preventDefault(); updateDetails(title, desc)}}>
      <Form.Row style={{marginBottom: '0px'}}>
        <Col xs={8}>
          <Form.Group>
            <Form.Label>
              <h3>Details</h3>
            </Form.Label>
            <Form.Control
              type="text"
              maxLength={100}
              value={title}
              placeholder="Title"
              onChange={(event => setTitle(event.target.value))}
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
