import React, {useEffect, useState, useRef} from "react";
import Stop from '../icons/Stop.svg';
import "./RecordPage.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useHistory, Prompt} from "react-router";
import { ReactMic } from 'react-mic';   
import {UpdateFile} from "../actions/FileActions";
import {useDispatch} from "react-redux";

const descPage = "/create/description";


export default function RecordPage() {
    const [timerTimeout, setTimerTimeout] = useState();
    const [countdownTimeout, setCountdownTimeout] = useState();

    const [number, setNumber] = useState(3);
    const [timer, setTimer] = useState(60);
    const [loc, setLoc] = useState("words");
    const stateRef = useRef<any>();

    // work around so loc's state is always up to date in onStop()
    stateRef.current = loc;

    const history = useHistory();
    const dispatch = useDispatch();


    const stopRecording = () => {
        setLoc(descPage);
    };

    const onStop = (recordedBlob: any) => {

        if (stateRef.current === descPage) {
            const file = new File([recordedBlob.blob], "recorded-lick", {type: "audio/webm", lastModified: Date.now()});
            dispatch(UpdateFile(file));
        } 
        
        history.push(stateRef.current); // redirect user to desired location
    }

    const startTimer = (num: number) => {
        setTimer(num);
        if (num > 0) {
            const timeout = setTimeout(() => {startTimer(num - 1)}, 1000);
            setTimerTimeout(timeout);
        } else {
            setLoc("words");
        }
    }

    const startCountDown = (num: number) => {
        setNumber(num);
        if (num > 0) {
            const timeout = setTimeout(() => {startCountDown(num - 1)}, 1000);
            setCountdownTimeout(timeout);
        } else {
            setLoc("");
            startTimer(timer);
        }
    }

    useEffect(()=> {
        startCountDown(number);

    // eslint-disable-next-line
    }, []);

    useEffect(()=> {
        return () => { clearTimeout(timerTimeout); clearTimeout(countdownTimeout); }
    }, [timerTimeout, countdownTimeout]);

    return (
        <Container className="recordPageBody centered">
            <Prompt
                when={!loc}
                message={(location) => {
                    setLoc(location.pathname);

                    return false; // dont let user navigate
                }}
            />
            {loc
                ? <Row className="countdown">
                    {number}
                </Row>

                : <div>
                    <Row className="timer1">
                        <h1 className="timer">{timer === 60 ? '1:00' : timer < 10 ? `0:0${timer}` : `0:${timer}`}</h1>
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
            <div style={{display: loc ? 'none' : 'block' }}>
            <Row>
                <ReactMic
                    record={!loc}
                    className="sine-wave"
                    onStop={onStop}
                    strokeColor="#FFFFFF"
                backgroundColor="#12142C" /> 
            </Row>
            </div>
        </Container>
    )
}