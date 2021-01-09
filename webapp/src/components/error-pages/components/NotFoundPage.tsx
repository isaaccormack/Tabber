import React from "react";
import { Container, Row } from "react-bootstrap";

export default function NotFoundPage() {

  return (
    <Container>
      <Row className="justify-content-md-center">
        <h1>404 Not Found</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h3>The page you are looking for could not be found</h3>
      </Row>
    </Container>
  );
}