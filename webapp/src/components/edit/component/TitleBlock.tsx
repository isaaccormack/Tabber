import { Button, Col, Container, Row } from "react-bootstrap";
import { formatDateNoTime } from "../../library/component/FormattingHelpers";
import React from "react";

export default function TitleBlock(props: any) {
  return (
    <Row style={{marginTop: '40px'}}>
      <Col xs={5} className="align-self-center">
        <Row className="justify-content-md-end">
          <img id="play-button" src={props.icon} height={100} alt="play lick audio" style={{marginRight: '20px'}} onClick={props.handleAudio}/>
        </Row>
      </Col>
      <Col xs={7} className="align-self-center">
        <Row>
          <h1 style={{color: '#404040'}}>{props.lickName}</h1>
        </Row>
        <Row>
          {props.isLickPublic ?
            <Button disabled variant="success" style={{opacity: 1}}>Public</Button>
            :
            <Button disabled variant="danger" style={{opacity: 1}}>Private</Button>
          }
          <h3 style={{color: 'grey', textAlign: 'center', marginLeft: '10px'}}>{formatDateNoTime(props.dateLickUploaded)}</h3>
        </Row>
      </Col>
    </Row>
  );
}