import { Button, Row } from "react-bootstrap";
import RecordingIcon from "../../icons/recording.svg";
import { ReactMic } from "react-mic";
import React, { useEffect, useState } from "react";
import { tabLick } from "../common/tabLick";
import { UserInterface } from "../../../common/user/interface/UserInterface";
import { useSelector } from "react-redux";
import RootState from "../../../../store/root-state";
import { Prompt, useHistory } from "react-router";
import ArrowTipLightIcon from "../../../home-pages/icons/arrow-tip-light.svg";
import RetryIcon from "../../icons/retry.svg";
import CancelIcon from "../../icons/cancel.svg";

export default function RecordingPage(props: any) {
  const history = useHistory();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  const [abortRecording, setAbortRecording] = useState<boolean>(false);
  const [reactMicRecording, setReactMicRecording] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [timer, setTimer] = useState<number>(15);
  const [timerTimeout, setTimerTimeout] = useState();


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

  useEffect(() => {
    if (timer > 0) {
      setTimerTimeout(setTimeout(() => {
        setTimer((curr) => curr - 1)
      }, 1000));
    } else {
      setReactMicRecording(false);
    }
    return clearTimeout(timerTimeout);
  }, [timer]);

  const formatTimer = (timer: number) => {
    return timer > 9 ? "0:" + timer : "0:0" + timer;
  }

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
        <h1 style={{color: 'lightgray', textAlign: 'center'}}>
          {formatTimer(timer)}
        </h1>
      </Row>

      <Row style={{marginTop: '50px'}} className="justify-content-md-center">
        <ReactMic
          // MUST set record prop to true after component has mounted to begin recording
          record={reactMicRecording && !abortRecording}
          className="sine-wave"
          onStop={onStop}
          strokeColor="#75a9f9"
          backgroundColor="#ffffff" />
      </Row>

      <Row style={{marginTop: '50px'}} className="justify-content-md-center">
        <Button
          size="lg"
          style={{paddingLeft: '30px'}}
          variant="danger"
          onClick={() => window.location.reload()}
        >
          Cancel
          <img src={CancelIcon} height={17} alt="cancel icon" style={{marginLeft: '20px', marginBottom: '3px'}}/>
        </Button>

        <Button
          size="lg"
          style={{marginLeft: '60px', paddingLeft: '30px'}}
          variant="outline-secondary"
          onClick={() => {
          // if reactMicRecording(false) and setAbortRecording(true) are both set a race condition will arise
          // causing the lick to be tabbed instead of cancelled => use two variables to track state
          setAbortRecording(true)
        }}
        >
          Retry
          <img src={RetryIcon} height={22} alt="retry icon" style={{marginLeft: '20px', marginBottom: '3px'}}/>
        </Button>

        <Button
          size="lg"
          style={{marginLeft: '60px', paddingLeft: '30px'}}
          variant="success"
          onClick={() => setReactMicRecording(false)}
        >
          Finish Recording
          <img src={ArrowTipLightIcon} height={20} alt="little arrow icon" style={{marginLeft: '20px', marginBottom: '3px'}}/>
        </Button>
      </Row>

    </>
  );
}