import React from "react";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

// change css later
import "./LickCards.css";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import SharedWithIcon from "../icons/sharedWith.svg";
import PlayIcon from "../icons/play3.svg";
import {formatLickLength, formatCapo, formatDate} from "./FormattingHelpers"

export interface LickCardsProps {
    licks: LickInterface[];
    searchQuery: string;
    sortBy: string;
    ascending: boolean;
    selected: string[];
    handleSelectOne: (event: any) => void;
    setShowShareModal: (a: boolean) => void;
    handlePlayLick: (lickID: number) => void;
}

export default function LickCards(props: LickCardsProps) {
    const licks = props.licks;
    const searchQuery = props.searchQuery;
    const sortBy = props.sortBy;
    const ascending = props.ascending;
    const selected = props.selected;
    const handleSelectOne = props.handleSelectOne;
    const setShowShareModal = props.setShowShareModal;
    const handlePlayLick = props.handlePlayLick;

    const handleSortLicks = (a: LickInterface, b: LickInterface): number => {
            const greater = ascending ? 1 : -1;
            const less = -greater;

            switch(sortBy) {
                case 'Date Created':
                    return (a.dateUploaded > b.dateUploaded) ? greater : less;
                case 'Length':
                    if (a.audioLength === b.audioLength) {
                        return (a.name.toLowerCase() > b.name.toLowerCase()) ? greater : less;
                    }
                    return (a.audioLength > b.audioLength) ? greater : less;
                default: // Title
                    return (a.name.toLowerCase() > b.name.toLowerCase()) ? greater : less;
            }
    }

    const handleFilterBySearch = (lick: LickInterface) => {
        return !searchQuery || lick.name.toLowerCase().indexOf(searchQuery) === 0;
    }

    const handleRenderCard = (lick: LickInterface) => {
        return (
            <Col key={lick.id}>
                <Card className="lick-card">
                    <Card.Body>
                        <Row>
                            <Col xs={9}>
                                <Card.Title>{lick.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{formatDate(lick.dateUploaded)}</Card.Subtitle>
                            </Col>
                            <Col>
                                <Form.Check onChange={handleSelectOne}
                                            checked={selected.includes(lick.id.toString())}
                                            id={lick.id.toString()}
                                            type="checkbox"
                                            />
                            </Col>
                        </Row>
                        <Row>
                            {/* <Col xs={2} style={{backgroundColor: "gray", padding: 10, borderRadius: "50%"}} className="my-auto"> */}
                            <Col onClick={() => {setShowShareModal(true)}} xs={2} className="my-auto share-btn">
                                {/* TODO: onClick, open share modal with this modal being shared */}
                                {/* TODO: onHover, display background circle */}
                                <img src={SharedWithIcon} height={25} alt="shared with" style={{opacity: lick.sharedWith.length === 0 ? 0.6 : 1}}/>
                            </Col>
                            <Col xs={10} className="text-right">
                                <p className="lick-details">{lick.tuning}</p>
                                <p className="lick-details">{formatCapo(lick.capo)}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={6}>
                                <img src={PlayIcon} height={60} onClick={() => {handlePlayLick(lick.id)}} alt="play lick"/>
                            </Col>
                            <Col xs={6} className="text-right my-auto">
                                <h1 className="lick-details">{formatLickLength(lick.audioLength)}</h1>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            )
        }
    
    return (() => {
        const renderedLicks = licks.sort(handleSortLicks).filter(handleFilterBySearch).map(handleRenderCard);

        if (renderedLicks.length === 0) {
            return (
                <Row className="justify-content-center">
                    <h1 className="no-licks">
                        No licks found
                    </h1>
                </Row>
            )
        } else {
            return (
                <Row xs={1} md={2} lg={3}>
                    {renderedLicks}
                </Row>
            )
        }
    })()
}
