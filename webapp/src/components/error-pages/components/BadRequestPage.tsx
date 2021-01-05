import React from "react";
import { Container, Row } from "react-bootstrap";

export default function BadRequestPage() {

  return (
    <Container>
      <Row className="justify-content-md-center">
        <h1>400 Bad Request</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h3>Lick doesn't exist</h3>
      </Row>
    </Container>
  );
}