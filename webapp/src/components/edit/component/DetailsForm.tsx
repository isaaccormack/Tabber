import React from "react";
import { Button, Col, Form } from "react-bootstrap";

export default function DetailsForm(props: any) {
  return (
    <Form>
      <Form.Row>
        <Col xs={8}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label><h3>Details</h3></Form.Label>
            <Form.Control type="text" value={'title'} placeholder="Title" />
          </Form.Group>
        </Col>
        <Col className="align-self-end ml-auto"  style={{paddingBottom: '16px'}} xs={4}>
          <Button variant="primary" type="submit">
            Save Details
          </Button>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group controlId="formBasicPassword">
            {/*<Form.Control type="text" value={props.lickDescription} placeholder="Description" />*/}
            <Form.Control type="text" value={'description'} placeholder="Description" />
          </Form.Group>
        </Col>
      </Form.Row>
    </Form>
  );
}
