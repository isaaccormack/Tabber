import {useHistory} from "react-router";
import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import {History} from "history";
import moment from "moment";

import "../../library/component/LibraryTable.css";
import "./SharedTable.css";

export interface SharedTableProps {
    licks: LickInterface[]
    selected?: LickInterface
    setSelected: Function
}

export default function SharedTable(props: SharedTableProps) {
    const selected = props.selected;
    const setSelected = props.setSelected;

    const history = useHistory();
    if (!props.licks || props.licks.length < 1) {
        return (<div>We could not find any licks shared with your account.</div>)
    }

    return (
        <Container fluid className="library-table">
            <Row className="table-header">
                <Col xs={5}>&nbsp;&nbsp;&nbsp;&nbsp;Name</Col>
                <Col xs={2}>Length</Col>
                <Col xs={3}>Created Date</Col>
                <Col xs={2}>Owner</Col>
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
                     >
                    <Col xs={5}>
                        <span className="play-button"
                              onClick={()=> {
                                setSelected(lick);
                            }}>
                            &#9658;
                        </span>
                        &nbsp;&nbsp;{lick.name}
                    </Col>
                    <Col xs={2}>{lick.audioLength}</Col>
                    <Col xs={3}>{date}</Col>
                    <Col xs={2}>{lick.owner.name}</Col>
                </Row>
            )
        })
    }
    return {}
}