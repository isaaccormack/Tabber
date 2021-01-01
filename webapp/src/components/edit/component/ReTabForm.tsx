import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function ReTabForm(props: any) {
  return (
    <Form>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridState" xs={5}>
          <Form.Label><h3>Tuning</h3></Form.Label>

          <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>...</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState" className="align-self-end" xs={4}>
          <Form.Label><h3>Capo</h3></Form.Label>

          <Form.Control as="select" defaultValue="Choose...">
            <option>Choose...</option>
            <option>...</option>
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState" className="align-self-end" xs={3}>
          <Button id="re-tab-button" variant="warning" type="submit">
            Submit
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
