import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import Record from '../icons/Record.svg';
import OrIcon from "../icons/OrIcon.svg";

import './CreatePage.css';
import UploadButton from "./UploadButton";

export default function CreatePage() {

    return(
        <Container className="createPageBody centered">
            <Row>
                <img src={Record} className='recordButton' alt='record button' />
            </Row>
            <br />
            <Row>
                <img src={OrIcon} className='OrIcon' alt='OR icon' />
            </Row>
            <br />
            <Row>
               <UploadButton />
            </Row>
        </Container>
    );
}