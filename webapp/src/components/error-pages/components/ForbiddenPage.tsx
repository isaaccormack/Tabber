import React from "react";
import { Container, Row } from "react-bootstrap";

export default function ForbiddenPage() {

  return (
    <Container>
      <Row className="justify-content-md-center">
        <h1>403 Forbidden</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h3>You are not authorized to view this page</h3>
      </Row>
    </Container>
  );
}