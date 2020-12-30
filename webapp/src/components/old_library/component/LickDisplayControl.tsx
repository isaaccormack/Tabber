import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import "./LickDisplayControl.css"
import SquaresIcon from "../icons/whiteSquares.svg";
import LinesIcon from "../icons/whiteLines.svg";
import SortArrowAscIcon from "../icons/whiteSortArrowAsc.svg";
import SortArrowDescIcon from "../icons/whiteSortArrowDesc.svg";

export interface LickDisplayControlProps {
    displayCards: boolean;
    sortBy: string;
    ascending: boolean;
    setDisplayCards: (a: boolean) => void;
    setSearchQuery: (a: string) => void;
    setSortBy: (a: string) => void;
    setAscending: (a: boolean) => void;

}

export default function LickDisplayControl(props: LickDisplayControlProps) {
    const displayCards = props.displayCards;
    const sortBy = props.sortBy;
    const ascending = props.ascending;
    const setDisplayCards = props.setDisplayCards;
    const setSearchQuery = props.setSearchQuery;
    const setSortBy = props.setSortBy;
    const setAscending = props.setAscending;

    return (
        <Row className="lick-display-control">
            <Col xs={3} md={2}>
                <Row>
                    <ButtonGroup>
                        <Button onClick={() => {setDisplayCards(true)}} active={displayCards} variant="secondary">
                            <img className="squares"
                                height={23}
                                width={23}
                                alt="display licks as cards"
                                src={SquaresIcon}
                            />
                        </Button>
                        <Button onClick={() => {setDisplayCards(false)}} active={!displayCards} variant="secondary">
                            <img className="lines"
                                height={23}
                                width={23}
                                alt="display licks in table"
                                src={LinesIcon}
                            />
                        </Button>
                    </ButtonGroup>
                </Row>
            </Col>
            <Col xs={4} sm={4} md={6} lg={7}>
                <Form.Control type="text" placeholder="Search" onChange={(event: any) => {setSearchQuery(event.target.value)}}/>
            </Col>
            {displayCards &&
                <Col xs={4} sm={5} md={4} lg={3}>
                    <Row className="justify-content-end"> 
                        <ButtonGroup>
                            <DropdownButton as={ButtonGroup} onSelect={(eventKey: string) => {setSortBy(eventKey)}} variant="secondary" id="dropdown-basic-button" title={sortBy}>
                                <Dropdown.Item active={sortBy==="Date Created"} eventKey="Date Created">Date Created</Dropdown.Item>
                                <Dropdown.Item active={sortBy==="Length"} eventKey="Length">Length</Dropdown.Item>
                                <Dropdown.Item active={sortBy==="Title"} eventKey="Title">Title</Dropdown.Item>
                            </DropdownButton>
                            <Button onClick={() => {setAscending(!ascending)}} variant="secondary">
                                <img className="sortArrow"
                                    height={17}
                                    width={17}
                                    alt="change order of sorting"
                                    src={ascending ? SortArrowAscIcon : SortArrowDescIcon}/>
                            </Button>
                        </ButtonGroup>
                    </Row>
                </Col>
            }
        </Row>
    )
}
