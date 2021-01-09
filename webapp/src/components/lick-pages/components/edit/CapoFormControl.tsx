import { Form } from "react-bootstrap";
import { formatCapo } from "../../../common/utils/formattingHelpers";
import React from "react";

export default function CapoFormControl(props: any) {

  const capoPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => formatCapo(num));

  return (
    <Form.Control as="select" onChange={event => props.setCapo(parseInt(event.target.value))}>
      {capoPositions.map((capoPosition: string, index) => {
        return (
          <option
            key={index}
            selected={formatCapo(props.capo) === capoPosition}
            value={index.toString()}
          >
            {capoPosition}
          </option>
        );
      })}
    </Form.Control>
  );
}