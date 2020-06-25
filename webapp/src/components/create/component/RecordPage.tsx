import React, {useCallback, useEffect, useState} from "react";
import Stop from '../icons/Stop.svg';
import "./RecordPage.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useHistory, Prompt} from "react-router";
import {useSelector} from "react-redux";
import RootState from "../../../store/root-state";
import { ReactMic } from 'react-mic';   



import {useDispatch} from "react-redux";
import { StopRecording } from "../actions/RecordActions";
import { BeginRecording } from "../actions/RecordActions";

// KNOW DEFECT -> The user can only navigate away from the page by
// clicking on the stop button or by pressing the back arrow,
// any other way does not stop the react-mic from recording

export default function RecordPage() {
    const [timerTimeout, setTimerTimeout] = useState();
    const [countdownTimeout, setCountdownTimeout] = useState();

    const [timer, setTimer] = useState(60);
    const [rec, setRec] = useState(false);
    const [number, setNumber] = useState(3)

    const history = useHistory();
    const dispatch = useDispatch();

    const stopRecording = () => {
        setRec(false);
    };


    const startTimer = (num: number) => {
        setTimer(num);
        if (num > 0) {
            const timeout = setTimeout(() => {startTimer(num - 1)}, 1000);
            setTimerTimeout(timeout);
        } else {
            setRec(false);
        }
    }

    const startCountDown = (num: number) => {
        setNumber(num);
        if (num > 0) {
            const timeout = setTimeout(() => {startCountDown(num - 1)}, 1000);
            setCountdownTimeout(timeout);
        } else {
            setRec(true);
            startTimer(timer);
        }
    }

    useEffect(()=> {
        startCountDown(number);
    }, []); // empty dependencies so startCountDown() is only called once

    useEffect(()=> {
        return () => { clearTimeout(timerTimeout); clearTimeout(countdownTimeout); }
    }, [timerTimeout, countdownTimeout]);

    const onData = (recordedBlob: any) => {
        // console.log('chunk of real-time data is: ', recordedBlob);
        console.log('onData recording = ' + rec)
    }
    
    // type this later
    const onStop = (recordedBlob: any) => {
        console.log(recordedBlob)
        // write this recordedBlob to redux for it to be saved

        // console.log('recordedBlob is: ', recordedBlob);
        console.log('onStop recording = ' + rec)
        console.log('STOPPED')
        history.push('/create/trim');
    }


    return (
        <Container className="recordPageBody centered">
            {/* make this display as modal */}
            <Prompt
                when={rec}
                message={() => {
                    console.log("leaving");
                    setRec(false); // intercept request to leave page to disable react-mic
                    return true; // always allow user to navigate back
                }}
            />
            {!rec
                ? <Row className="loading centered">
                    {number}
                </Row>

                : <div>
                    <Row className="timer">
                        {timer === 60 ? '1:00' : `0:${timer}`}
                    </Row>
                    <Row className="button">
                        <label htmlFor={"stop"}>
                            <img src={Stop}
                                    className='stopButton'
                                    alt='stop button'
                                    onClick={() => stopRecording()}/>
                        </label>
                    </Row>
                </div>
            }
            <Row>
                <ReactMic
                    record={rec}
                    className="sine-wave"
                    onStop={onStop}
                    onData={onData}
                    strokeColor="#000000"
                    backgroundColor="#FF4081" />
            </Row>
        </Container>
    )
}