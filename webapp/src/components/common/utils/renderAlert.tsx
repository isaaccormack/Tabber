import React from "react";
import { AlertInterface } from "./useAlertTimeouts";
import { Alert } from "react-bootstrap";

export default function renderAlert(alert: AlertInterface | undefined, setAlert: Function) {
  if (alert) {
    return (
      <Alert
        style={{marginTop: '5px'}}
        dismissible
        variant={alert.variant}
        onClose={() => setAlert(undefined)}
      >
        {alert.msg}
      </Alert>
    );
  } else {
    return <></>;
  }
}
