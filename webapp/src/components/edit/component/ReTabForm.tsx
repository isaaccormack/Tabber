import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { formatCapo } from "../../library/component/FormattingHelpers";

export default function ReTabForm(props: any) {
  const tunings = ['Standard', 'Drop D', 'Open G'];
  // TODO: create capo positions from calling formatCapo() on 0 to 9 int array
  const capoPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => formatCapo(num));

  return (
    <Form onSubmit={(e: any) => {e.preventDefault()}}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridState" xs={5}>
          <Form.Label><h3>Tuning</h3></Form.Label>

          <Form.Control as="select" onChange={(event => {
            console.log(event.target.value)
            props.setTuning(event.target.value)
          })}>
            {tunings.map((tuning: string) => {
              return <option key={tuning} selected={props.tuning === tuning} value={tuning}>{tuning}</option>;
            }) }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} className="align-self-end" xs={4}>
          <Form.Label><h3>Capo</h3></Form.Label>

          <Form.Control as="select" onChange={(event => {
            console.log(event.target.value);
            props.setCapo(parseInt(event.target.value))
          })}>
            {capoPositions.map((capoPosition: string, index) => {
              return <option key={index} selected={formatCapo(props.capo) === capoPosition} value={index.toString()}>{capoPosition}</option>;
            }) }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState" className="align-self-end" xs={3}>
          <Button
            id="re-tab-button"
            variant="warning"
            type="submit"
            onClick={() => props.setShowReTabModal(true)}
            disabled={props.capo === props.initCapo && props.tuning === props.initTuning}
          >
            Re-Tab
          </Button>
        </Form.Group>
      </Form.Row>
    </Form>
  );
}
