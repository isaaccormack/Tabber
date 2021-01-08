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

export default function RecordPage() {
  const history = useHistory();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  const [tuning, setTuning] = useState<string>("Standard");
  const [capo, setCapo] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const [showForm, setShowForm] = useState<boolean>(true);

  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  const [reactMicRecording, setReactMicRecording] = useState<boolean>(false);
  // must be true initially so abortRecording callback is triggered when the recording callback sets this to false
  const [abortRecording, setAbortRecording] = useState<boolean>(true);

  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);
  useRedirectAlerts(setAlert, "uploading", "", "danger");

  const [recording, setRecording] = useState<boolean>(false);

  // need to explicitly switch record from false to true in ReactMic after it is mounted to make it start recording
  useEffect(() => {
    if (recording) {
      setAbortRecording(false);
    }
  }, [recording])

  // abortRecording callback -- needed because dont want to unmount ReactMic before it has stopped
  useEffect(() => {
    if (abortRecording) {
      setRecording(false);
    } else {
      setReactMicRecording(true);
    }
  }, [abortRecording])

  const onStop = (recordedBlob: any) => {
      setFile(new File([recordedBlob.blob], "my lick", {type: "audio/webm", lastModified: Date.now()}));
  }

  useEffect(() => {
    if (file && !abortRecording) {
      tabLick(history, file, capo, tuning, user as boolean, '/record');
    }
  }, [file])

  return (
    <Container>
      {renderAlert(alert, setAlert)}
      {reactMicRecording &&
        <Prompt
          when={true}
          message={(location) => {
            // MUST manually reload the page instead of relying on react-router to unmount ReactMic
            // component so it stops recording
            // if this doesn't happen, the mic will record in background after page navigation and leak memory
            window.location.href = location.pathname;
            return true;
          }}
        />
      }
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
            <>
              {/* unmounting react mic will force it to call onStop */}

              {/* need cancel button here */}
              <Row style={{marginTop: '50px'}} className="justify-content-md-center">
                <h1 style={{color: '#444444', textAlign: 'center'}}>
                  {'Recording...'}
                </h1>
                <img id="recording-icon" src={RecordingIcon} height={50} alt="recording icon" style={{marginLeft: '35px'}}/>
              </Row>

              <Row style={{marginTop: '50px'}} className="justify-content-md-center">
                <h1 style={{color: '#444444', textAlign: 'center'}}>
                  {'Recording...'}
                </h1>
                <img id="recording-icon" src={RecordingIcon} height={50} alt="recording icon" style={{marginLeft: '35px'}}/>
              </Row>


              {/*<div style={{display: startReactMic ? 'block' : 'none' }}>*/}
                <Row>
                  <ReactMic
                    // need to switch record from false to true once component mounts to force recording
                    record={reactMicRecording && !abortRecording}
                    className="sine-wave"
                    onStop={onStop}
                    strokeColor="#75a9f9"
                    backgroundColor="#ffffff" />
                </Row>
              {/*</div>*/}

              <NavigationButton variant="danger" desc="Cancel" onClick={() => {
                // if I set both reactMicRecording(false) and setAbortRecording(true) I will have a race condition and
                // the lick might be accidentally tabbed as abortRecording(true) might not be set until well after the
                // the other var, causing a tab lick control flow to occur
                setAbortRecording(true)
              }}/>
              <NavigationButton variant="success" desc="Finish Recording" onClick={() => setReactMicRecording(false)}/>
            </>
          }
        </>
      }
    </Container>
  );
}