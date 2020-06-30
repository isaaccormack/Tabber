import React, {useCallback, useEffect, useState, useRef} from "react";
import Stop from '../icons/Stop.svg';
import "./RecordPage.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useHistory, Prompt} from "react-router";
import {useSelector} from "react-redux";
import RootState from "../../../store/root-state";
import { ReactMic } from 'react-mic';   
import {UpdateFile} from "../actions/FileActions";




import {useDispatch} from "react-redux";
import { StopRecording } from "../actions/RecordActions";
import { BeginRecording } from "../actions/RecordActions";

const descPage = "/create/description";

// the way that the 

export default function DummyRecordPage() {
    const [loc, setLoc] = useState("init");
    const stateRef = useRef<any>();

    // work around to read loc's state in onStop()
    stateRef.current = loc;

    const history = useHistory();
    const dispatch = useDispatch();

    const stopRecording = () => {
        setLoc(descPage);
    };
    
    const onData = (recordedBlob: any) => {
        console.log('onData')
    }

    const onStop = (recordedBlob: any) => {
        console.log(stateRef.current)
        console.log('onStop')

        //
        if (stateRef.current === descPage) {
            // yikes this is a webm file, need to convert this to wav
            const file = new File([recordedBlob.blob], "recorded-lick", {type: "audio/webm", lastModified: Date.now()});
            dispatch(UpdateFile(file));

        }
        
        // handle blob here
        
        history.push(stateRef.current); // redirect user to desired location
    }

    useEffect(()=> {
        setLoc(""); // make loc falsey
        console.log(loc)
    }, []);

    return (
        <Container className="recordPageBody centered">
            <Prompt
                when={!loc}
                message={(location) => {
                    setLoc(location.pathname);

                    return false; // dont let user navigate
                }}
            />
            <Row>
                <ReactMic
                    record={!loc}
                    className="sine-wave"
                    onStop={onStop}
                    onData={onData}
                    strokeColor="#000000"
                backgroundColor="#FF4081" /> 
            </Row>
            <Row className="button">
                <label htmlFor={"stop"}>
                    <img src={Stop}
                            className='stopButton'
                            alt='stop button'
                            onClick={() => stopRecording()}/>
                </label>
            </Row>
        </Container>
    )
}