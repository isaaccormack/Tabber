import { Form } from "react-bootstrap";
import React from "react";

export default function TuningFormControl(props: any) {
  // TODO: clean this up between front and back end for less bugs..
  const tunings = ['Standard', 'Drop D', 'Open G'];

  return (
    <Form.Control as="select" onChange={event => props.setTuning(event.target.value)}>
      {tunings.map((tuning: string) => {
        return (
          <option
            key={tuning}
            selected={props.tuning === tuning}
            value={tuning}
          >
            {tuning}
          </option>
        );
      })}
    </Form.Control>
  );
}
