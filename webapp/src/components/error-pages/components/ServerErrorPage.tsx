import React, { useState } from "react";
import { useRedirectAlerts } from "../../common/utils/useRedirectAlerts";
import { AlertInterface } from "../../common/utils/useAlertTimeouts";
import { Container, Row } from "react-bootstrap";

// going to need this if upload fails
export default function ServerErrorPage() {

  const [alert, setAlert] = useState<AlertInterface>();

  useRedirectAlerts(setAlert, "get-lick", "Lick could not be retrieved");

  return (
    <Container>
      <Row className="justify-content-md-center">
        <h1>500 Server Error</h1>
      </Row>
      {alert &&
        <Row className="justify-content-md-center">
          <h3>{alert.msg}</h3>
        </Row>
      }
    </Container>
  );
}