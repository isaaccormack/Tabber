import React, {useState} from 'react';
import Record from '../icons/Record.svg';
import "./RecordPage.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/Dropdown';
// import {useDispatch} from "react-redux";


export default function PreRecordPage() {

    const [tuning, setTuning] = useState(null) // this should just go into redux, do when splitting code into module
    const [err, setErr] = useState(false)

    // const dispatch = useDispatch();

    const onRecordClick = () => {
        // tuning is probably going to be pulled from redux here not local state since it needs
        // to be in redux when request is sent later
        if (tuning) {
            // use redux to set recording state to 1 here
        } else {
            setErr(true);
        }
    }

    const onTuningSelect = (eventKey: any) => {
        // dispatch the tuning state to redux
        setTuning(eventKey); // do this for now
        setErr(false);
    }

    return (
        <Container className="preRecordPageBody centered">
            <Row className="button">
                <div>
                    <img src={Record}
                         className='recordButton'
                         alt='record button'
                         onClick={() => onRecordClick()}/>
                </div>
            </Row>
            <Row className="textInput">
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
            {err && <Row>
                Please select a tuning
            </Row>}
        </Container>
    )
}