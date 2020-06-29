import {Col, Container, Row} from "react-bootstrap";
import React from "react";
import {History} from 'history';
import moment from 'moment';

import "./LibraryTable.css";
import {useHistory} from "react-router";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import SharedIcon from "../../common/navigation/icons/shared.svg";

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
                <Col xs={6}>&nbsp;&nbsp;&nbsp;&nbsp;Name</Col>
                <Col xs={2}>Length</Col>
                <Col xs={3}>Created Date</Col>
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
            const audioLength = lick.audioLength === 60? "1:00" : "0:" + String(lick.audioLength);

            return (
                <Row className="table-row"
                     id={playing}
                     key={i}
                     onClick={() => {
                         history.push("/edit/"+lick.id)
                     }}>
                    <Col xs={6}>
                        <span className="play-button"
                              onClick={(e)=> {
                                  e.stopPropagation();
                                  setSelected(lick);
                              }}>
                            &#9658;
                        </span>
                        &nbsp;&nbsp;{lick.name}
                    </Col>
                    <Col xs={2}>{audioLength}</Col>
                    <Col xs={3}>{date}</Col>
                    <Col xs={1}>
                        {lick.sharedWith.length > 0 &&
                        <img src={SharedIcon} className="icon" alt="shared" />
                        }
                    </Col>
                </Row>
            )
        })
    }
    return {}
}