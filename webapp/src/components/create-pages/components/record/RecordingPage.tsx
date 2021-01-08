import { Container, Row } from "react-bootstrap";
import RecordingIcon from "../../icons/recording.svg";
import { ReactMic } from "react-mic";
import NavigationButton from "../../../home-pages/components/common/NavigationButton";
import React, { useEffect, useState } from "react";
import { tabLick } from "../common/tabLick";
import { UserInterface } from "../../../common/user/interface/UserInterface";
import { useSelector } from "react-redux";
import RootState from "../../../../store/root-state";
import { Prompt, useHistory } from "react-router";

export default function RecordingPage(props: any) {
  const history = useHistory();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  const [abortRecording, setAbortRecording] = useState<boolean>(false);
  const [reactMicRecording, setReactMicRecording] = useState<boolean>(false);
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (abortRecording) {
      props.setRecording(false);
    } else {
      setReactMicRecording(true);
    }
  }, [abortRecording])

  const onStop = (recordedBlob: any) => {
    setFile(new File([recordedBlob.blob], "my lick", {type: "audio/webm", lastModified: Date.now()}));
  }

  useEffect(() => {
    if (file && !abortRecording) {
      tabLick(history, file, props.capo, props.tuning, user as boolean, '/record');
    }
  }, [file])

  return (
    <>
      {reactMicRecording &&
      <Prompt
        when={true}
        message={(location) => {
          // MUST manually reload page when navigating away to stop ReactMic from recording, avoiding memory leak
          window.location.href = location.pathname;
          return true;
        }}
      />
      }
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

      <Row>
        <ReactMic
          // MUST set record prop to true after component has mounted to begin recording
          record={reactMicRecording && !abortRecording}
          className="sine-wave"
          onStop={onStop}
          strokeColor="#75a9f9"
          backgroundColor="#ffffff" />
      </Row>

      <NavigationButton variant="danger" desc="Cancel" onClick={() => {
        window.location.reload();
      }}/>

      <NavigationButton variant="outline-secondary" desc="Retry" onClick={() => {
        // if I set both reactMicRecording(false) and setAbortRecording(true) I will have a race condition and
        // the lick might be accidentally tabbed as abortRecording(true) might not be set until well after the
        // the other var, causing a tab lick control flow to occur
        setAbortRecording(true)
      }}/>
      <NavigationButton variant="success" desc="Finish Recording" onClick={() => setReactMicRecording(false)}/>
    </>
  );
}