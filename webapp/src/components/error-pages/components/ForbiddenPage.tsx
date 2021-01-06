import React, { useState } from "react";
import { AlertInterface } from "../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../common/utils/useRedirectAlerts";
import { Container, Row } from "react-bootstrap";

export default function ForbiddenPage() {

  const [alert, setAlert] = useState<AlertInterface>();

  // TODO: change err message
  useRedirectAlerts(setAlert, "get-lick", "You are not authorized to view this lick", "danger");

  return (
    <Container>
      <Row className="justify-content-md-center">
        <h1>403 Forbidden</h1>
      </Row>
      {alert &&
      <Row className="justify-content-md-center">
        <h3>{alert.msg}</h3>
      </Row>
      }
    </Container>
  );
}