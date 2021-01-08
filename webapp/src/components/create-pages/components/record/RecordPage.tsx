import React, { useEffect, useRef, useState } from "react";
import { Button, Container, Form, Row } from "react-bootstrap";
import TitleBlock from "./TitleBlock";
import TuningCapoForm from "./TuningCapoForm";
import { AlertInterface, useAlertTimeouts } from "../../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../../common/utils/useRedirectAlerts";
import renderAlert from "../../../common/utils/renderAlert";
import { ReactMic } from "react-mic";
import { Prompt, useHistory } from "react-router";
import { tabLick } from "../common/tabLick";
import NavigationButton from "../../../home-pages/components/common/NavigationButton";
import { UserInterface } from "../../../common/user/interface/UserInterface";
import { useSelector } from "react-redux";
import RootState from "../../../../store/root-state";
import RecordingIcon from "../../icons/recording.svg"
import Countdown from "./Countdown";
import "./RecordPage.css"
import RecordingPage from "./RecordingPage";

// Note, the abort logic is complicated because we are trying to save state of this component and essentially just rollback state
// to the point where record just became true. Memory leak, saving state, and wrong api call -> take your pick, this is why logic
// is so complicated, to save off any of these wrongfully happening
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
        <>
          {!recording ?
            <Countdown setRecording={setRecording}/>
          :
            // <h1>fdfasdfs</h1>
            <RecordingPage recording={recording} setRecording={setRecording} capo={capo} tuning={tuning}/>
          }
        </>
      }
    </Container>
  );
}