import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export default function ReTabForm(props: any) {
  const tunings = ['Standard', 'Drop D', 'Open E'];
  const capoPositions = ['No Capo', '1st Fret', '2nd Fret', '3rd Fret', "4th Fret", "5th Fret", "6th Fret", "7th Fret", "8th Fret", "9th Fret"];

  return (
    <Form onSubmit={(e: any) => {e.preventDefault()}}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridState" xs={5}>
          <Form.Label><h3>Tuning</h3></Form.Label>

          <Form.Control as="select" defaultValue={tunings[0]}>
            {tunings.map((tuning: string) => {
              return <option value={tuning}>{tuning}</option>;
            }) }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState" className="align-self-end" xs={4}>
          <Form.Label><h3>Capo</h3></Form.Label>

          <Form.Control as="select" defaultValue={capoPositions[0]}>
            {capoPositions.map((capoPosition: string, index) => {
              return <option value={index}>{capoPosition}</option>;
            }) }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState" className="align-self-end" xs={3}>
          <Button id="re-tab-button" variant="warning" type="submit" onClick={() => props.setShowReTabModal(true)}>
            Re-Tab
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
