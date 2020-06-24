import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
import { ReactMic } from 'react-mic';
import {useHistory} from "react-router";


// import {useDispatch, useSelector} from "react-redux";

import './RecordPage.css';
// import RootState from "../../../store/root-state";
import Record from '../icons/Record.svg';
import Stop from '../icons/Stop.svg';

// add reducers and actions

// business logic is:
//   - button and tuning options are displayed
//   - tuning options is a drop down with a couple options
//   - pressing the record burron 

// this just has the record button and then a text input where the tuning is input

// use that state thing vernon was going to change the tuning to be displayed

// enum Recording {
//     Up = 1,
//     Down,
//     Left,
//     Right,
// }



export default function RecordPage() {
    
    const [tuning, setTuning] = useState(null) // this should just go into redux, do when splitting code into modules
    const [recordingState, setRecordingState] = useState(0) // this should just go into redux
    const [err, setErr] = useState("") // maybe theres a better way to do this
    const [number, setNumber] = useState("3")
    const [intervalId, setintervalId] = useState()
    const [recording, setRecording] = useState(false)
    const [timer, setTimer] = useState(59)
    
    const history = useHistory();
    // const file: FileList | undefined = useSelector((state: sRootState) => state.fileState.file);

    // this chaining of functions from other functions will be replaced by tasks being spun off
    // when other components are mounted, ie. when the record page loads it will start a timer 
    // interal to update the time which we have been recording for
    const onRecordClick = () => {
        if (!tuning) {
            setErr("Please select a tuning");
        } else {
            // here we start the react mic recording but only after the user has allowed the mic in the
            // pop up
            setRecordingState(1); // enum(1) == begin countdown
            handleRecordingAnimation()
        }
    }
    
    const onStopClick = () => {
        setRecording(false);
        history.push("/create/trim");
    }
    
    // stuff in here is being called twice for some reason, figure out later
    const handleRecordingAnimation = () => {
        setintervalId(setInterval(() => {
            // must use functional update pattern to update state
            setNumber((lastNumber) => {
                if (lastNumber === "3") {
                    return "2";
                } else if (lastNumber === "2") {
                    return "1";
                } else {
                    setRecordingState(2); // enum(2) == begin recording
                    setRecording(true); // when this is moved into component it will be on mount
                    clearInterval(intervalId) // stop interval timer
                    handleRecordingTimer();
                    return "";
                }
            })
            
        }, 1000));
    }
    
    // REFACTOR THIS INTO SEPERATE MODULES AND USE USE_EFFECT to start the timers then see if
    // there is still problems with many timers running at once
    const handleRecordingTimer = () => {
        // interval id should never be used by both intervals concurrently, but
        // should check this with some print statements
        setintervalId(setInterval(() => {
            // must use functional update pattern to update state
            setTimer((lastTime) => {
                if (lastTime === 1) {
                    setRecording(false); // when this is moved into component it will be on mount
                    clearInterval(intervalId) // stop interval timer
                    history.push("/create/trim");
                    return 0;
                } else {
                    return lastTime - 1;
                }
            })

        }, 1000));
    }

    const onTuningSelect = (eventKey: any) => {
        setTuning(eventKey);
        // and dispatch the tuning state to redux
        // dispatch(UpdateFile(file));
    }


    // type this later
    const onData = (recordedBlob: any) => {
        console.log('chunk of real-time data is: ', recordedBlob);
    }
    
    // type this later
    const onStop = (recordedBlob: any) => {
        console.log('recordedBlob is: ', recordedBlob);
    }

    const getTuningOrRecord = () => {
        if (recordingState === 0) {
            // break this out into its own component
            return (
                // make this into its own css later
                <Container className="createPageBody centered">
                    <Row className="button">
                        {/* on click, if no tuning is set, print error message */}
                        <div>
                            <label htmlFor={"record"}>
                                <img src={Record} className='recordButton' alt='record button' onClick={() => onRecordClick()}/>
                            </label>
                        </div>
                    </Row>
                    <Row className="textInput">
                        {/* make this its own dropdown componenet? */}
                        {/* <Dropdown onSelect={(e) => onTuningSelect(e.target.files)}> */}
                        <Dropdown onSelect={(eventKey: any) => onTuningSelect(eventKey)}>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {tuning ? tuning : 'Select Tuning'}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item eventKey='Standard'>Standard</Dropdown.Item>
                                <Dropdown.Item eventKey='Drop D'>Drop D</Dropdown.Item>
                                <Dropdown.Item eventKey='Open G'>Open G</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Row>
                    <Row>
                        {/* worry about styling this later */}
                        {err}
                    </Row>
                </Container>

            );
        } else if (recordingState === 1) {
            // load the count down animation, when it completes, set recording state to 2
            return (
                <div className="loading centered">
                    {number}
                </div>            )
        } else { // recordingState == 2

            // this needs to display the time and also stop the lick from being recorded after 60 seconds
            // maybe start at 60s (1:00) and count down

            return (
                <div>
                    <Row className="timer">
                        {timer === 60 ? '1:00' : `0:${timer}`}
                    </Row>
                    <Row className="button">
                        {/* on click, if no tuning is set, print error message */}
                        <div>
                            <label htmlFor={"stop"}>
                                <img src={Stop} className='stopButton' alt='stop button' onClick={() => onStopClick()}/>
                            </label>
                        </div>
                        </Row>
                </div>
            )
        }
    }


    return (
        <Container className="createPageBody centered">
            {getTuningOrRecord()}
            <Row style={{display: recordingState === 2 ? 'block' : 'none' }} >
            {/* must always have ReactMic loaded on this page */}
                <ReactMic
                    record={recording}
                    className="sound-wave"
                    onStop={onStop}
                    onData={onData}
                    strokeColor="#000000"
                    backgroundColor="#FF4081" />
            </Row>
        </Container>
    )
}