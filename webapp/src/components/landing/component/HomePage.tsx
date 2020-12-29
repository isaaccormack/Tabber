import React from "react";
import Container from "react-bootstrap/Container";
import { Button, Col, Row } from "react-bootstrap";
import UploadIcon from "../icons/file-upload.svg";
import ArrowTipDarkIcon from "../icons/arrow-tip-dark.svg";
import MicrophoneIcon from "../icons/microphone.svg";
import ArrowTipLightIcon from "../icons/arrow-tip-light.svg";

export default function HomePage() {

  return (
    <Container>
      <Row className="justify-content-md-center" style={{marginTop: '50px'}}>
        <h1>Start Tabbing</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h3 style={{color: 'lightgrey', textAlign: 'center'}}>
          Tabber is only able to process licks in which a
          <span style={{fontWeight: 'bold', color: '#929292'}}>{' single note '}</span>
          is played at a time <br/>
          Double stops and chords
          <span style={{fontWeight: 'bold', color: '#929292'}}>{' can not '}</span>
          be tabbed
        </h3>
      </Row>
      <Row style={{marginTop: '150px'}}>
        <Col xs={6}>
          <Row className="justify-content-md-center">
            <img src={UploadIcon} height={200} alt="upload icon"/>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
            <h2>Upload</h2>
          </Row>
          <Row className="justify-content-md-center">
            <h4 style={{color: 'lightgrey'}}>Upload a lick you've already <br /> saved on your computer</h4>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '7px'}}>
            <Button variant="success" style={{borderRadius: '20px'}} onClick={() => {}}>
              <span style={{marginLeft: '55px'}}> </span>
              {'Get Uploading'}
              <img src={ArrowTipLightIcon} height={15} alt="little arrow icon" style={{marginLeft: '35px'}}/>
            </Button>
          </Row>
        </Col>
        <Col>
          <Row className="justify-content-md-center">
            <img src={MicrophoneIcon} height={200} alt="microphone icon"/>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
            <h2>Record</h2>
          </Row>
          <Row className="justify-content-md-center">
            <h4 style={{color: 'lightgrey'}}>Play a lick directly into your<br /> computers microphone</h4>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '7px'}}>
            <Button variant="warning" style={{borderRadius: '20px'}} onClick={() => {}}>
              <span style={{marginLeft: '55px'}}> </span>
              {'Start Recording'}
              <img src={ArrowTipDarkIcon} height={15} alt="little arrow icon" style={{marginLeft: '35px'}}/>
            </Button>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}