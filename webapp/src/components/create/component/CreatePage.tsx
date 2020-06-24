import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import {useHistory} from "react-router";

import Record from '../icons/Record.svg';
import OrIcon from "../icons/OrIcon.svg";

import './CreatePage.css';
import UploadButton from "./UploadButton";

export default function CreatePage() {

    const history = useHistory();

    return(
        <Container className="createPageBody centered">
            <Row className="button">
                {/* perhaps refactor this into its own component that can be reused? */}
                <div>
                    <label htmlFor={"record"}>
                        <img src={Record} className='recordButton' alt='record button' onClick={() => history.push("/create/record")}/>
                    </label>
                </div>
            </Row>
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