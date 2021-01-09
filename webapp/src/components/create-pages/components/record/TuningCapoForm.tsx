import { Col, Form, Row } from "react-bootstrap";
import TuningFormControl from "../../../lick-pages/components/edit/TuningFormControl";
import CapoFormControl from "../../../lick-pages/components/edit/CapoFormControl";
import NavigationButton from "../../../home-pages/components/common/NavigationButton";
import React from "react";

export default function TuningCapoForm(props: any) {
  return (
    <Row style={{marginTop: '70px'}}  className="justify-content-md-center">
      <Form onSubmit={(e: any) => e.preventDefault()}>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label as={Row} className="justify-content-md-center">
              <h3>Tuning</h3>
            </Form.Label>
            <TuningFormControl tuning={props.tuning} setTuning={props.setTuning} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{marginTop: '50px'}}>
          <Form.Group as={Col}>
            <Form.Label as={Row} className="justify-content-md-center">
              <h3>Capo</h3>
            </Form.Label>
            <CapoFormControl capo={props.capo} setCapo={props.setCapo} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{marginTop: '70px'}} className="justify-content-md-center">
          <NavigationButton variant="success" desc="Start Recording" onClick={() => props.setShowForm(false)}/>
        </Form.Row>
      </Form>
    </Row>
  );
}