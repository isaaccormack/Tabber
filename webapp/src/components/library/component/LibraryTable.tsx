import {Col, Container, Row} from "react-bootstrap";
import React, {useState} from "react";
import { History } from 'history';

import "./LibraryTable.css";
import {useHistory} from "react-router";

export interface LickInterface {
    id: number
    name: string
    description: string
    dateUploaded: string
    audioFileLocation: string
    audioLength: number
    tab: string,
    tuning: string
    isPublic: boolean,
    owner: any
}

export interface LibraryTableProps {
    licks: LickInterface[]
}

export default function LibraryTable(props: LibraryTableProps) {
    const [selected, setSelected] = useState<LickInterface>()
    const history = useHistory();
    if (!props.licks) {
        return (<div>We could not find any licks associated with your account.</div>)
    }

    return (
        <Container fluid className="library-table">
            <Row className="table-header">
                <Col xs={5}>Name</Col>
                <Col xs={2}>Length</Col>
                <Col xs={3}>Created Date</Col>
                <Col xs={2}>Actions</Col>
            </Row>
            <div className="scrollable">
                {renderTableBody(props.licks, selected, setSelected, history)}
            </div>

        </Container>
    )
}

function renderTableBody(data: LickInterface[],
                         selected: LickInterface | undefined,
                         setSelected: Function,
                         history: History) {

    if (data) {
        return data.map((lick: LickInterface, i: number) => {
            let playing = "";
            if (lick === selected) playing = "playing"
            return (
                <Row className="table-row" id={playing} onClick={()=> {
                    setSelected(lick);
                }}>
                    <Col xs={5}>{lick.name}</Col>
                    <Col xs={2}>{lick.audioLength}</Col>
                    <Col xs={3}>{lick.dateUploaded}</Col>
                    <Col xs={2}
                         className="edit-button"
                         onClick={() => {
                                 history.push("/edit/"+lick.id)
                             }}>
                        Edit
                    </Col>
                </Row>
            )
        })
    }
    return {}
}