import {Col, Container, Row} from "react-bootstrap";
import React, {useState} from "react";
import { History } from 'history';
import moment from 'moment';

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
    selected?: LickInterface
    setSelected: Function
}

export default function LibraryTable(props: LibraryTableProps) {
    const selected = props.selected;
    const setSelected = props.setSelected;

    const history = useHistory();
    if (!props.licks || props.licks.length < 1) {
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
            if (selected && lick.id === selected.id) playing = "playing"
            let date = moment(lick.dateUploaded).format("hh:mma MMM DD YYYY");
            return (
                <Row className="table-row"
                     id={playing}
                     key={i}
                     onClick={()=> {
                        setSelected(lick);
                     }}>
                    <Col xs={5}>{lick.name}</Col>
                    <Col xs={2}>{lick.audioLength}</Col>
                    <Col xs={3}>{date}</Col>
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