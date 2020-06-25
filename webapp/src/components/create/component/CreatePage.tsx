import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useHistory} from "react-router";

import Record from '../icons/Record.svg';
import OrIcon from "../icons/OrIcon.svg";

import './CreatePage.css';
import UploadButton from "./UploadButton";

export default function CreatePage() {
    const [permissionErr, setPermissionErr] = useState(false) // this should just go into redux

    const history = useHistory();

    const onRecordClick = () => {
        navigator.mediaDevices.getUserMedia( {audio: true })
        .then(() => { // user allows microphone
            history.push("/create/record");
        }).catch(() => {
            setPermissionErr(true);
        });

    }

    return(
        <Container className="createPageBody centered">
            <Row className="button">
                {/* perhaps refactor this into its own component that can be reused? */}
                <div>
                    <label htmlFor={"record"}>
                        <img src={Record} className='recordButton' alt='record button' onClick={() => onRecordClick()}/>
                    </label>
                </div>
            </Row>
            {permissionErr && <Row>
                Allow microphone to record a lick
            </Row>}
            <br />
            <Row>
                <img src={OrIcon} className='OrIcon' alt='OR icon' />
            </Row>
            <br />
            <Row className="button">
               <UploadButton />
            </Row>
        </Container>
    );
}