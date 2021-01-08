import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import TitleBlock from "./TitleBlock";
import TuningCapoForm from "./TuningCapoForm";
import { AlertInterface, useAlertTimeouts } from "../../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../../common/utils/useRedirectAlerts";
import renderAlert from "../../../common/utils/renderAlert";
import Countdown from "./Countdown";
import RecordingPage from "./RecordingPage";
import "./RecordPage.css"

export default function RecordPage() {

  const [tuning, setTuning] = useState<string>("Standard");
  const [capo, setCapo] = useState<number>(0);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [recording, setRecording] = useState<boolean>(false);

  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);
  useRedirectAlerts(setAlert, "uploading", "", "danger");

  return (
    <Container>
      {renderAlert(alert, setAlert)}
      {showForm ?
        <>
          <TitleBlock/>
          <TuningCapoForm
            tuning={tuning}
            setTuning={setTuning}
            capo={capo}
            setCapo={setCapo}
            setShowForm={setShowForm}
          />
        </>
        :
        <Row>
          <Col>
            {!recording ?
              <Countdown setRecording={setRecording}/>
            :
              <RecordingPage recording={recording} setRecording={setRecording} capo={capo} tuning={tuning}/>
            }
          </Col>
        </Row>
      }
    </Container>
  );
}