import React from "react";
import "./LandingPage.css";
import Container from "react-bootstrap/Container";
import { Row, Col, Button } from "react-bootstrap";

import UserIcon from "../icons/user.svg"
import GuitarIcon from "../icons/electric-guitar.svg"
import SingerIcon from "../icons/singer.svg"
import UploadIcon from "../icons/file-upload.svg"
import SheetMusicIcon from "../icons/music-sheet.svg"
import VinylsIcon from "../icons/vinyls.svg"
import FriendsIcon from "../icons/friends.svg"
import LoveIcon from "../icons/love.svg"
import ClockIcon from "../icons/clock.svg"
import JoggingIcon from "../icons/jogging.svg"







// TODO: probably in App.tsx the user state is checked and it is decided whether this page is rendered or another one for auth users
export default function LandingPage() {

  // TODO: make Rows be centered by default
    return (
        <Container>
            <Row className="justify-content-md-center" style={{marginTop: '50px'}}>
              <h1>Play Licks, Get Tabs</h1>
            </Row>
          <Row className="justify-content-md-center">
            <h3 style={{ color: 'lightgrey' }}>Upload or record a lick, have it tabbed automatically</h3>
          </Row>
          <Row style={{marginTop: '50px'}}>
            <Col xs={6}>
              <Row className="justify-content-md-center">
                <img src={UserIcon} height={75} alt="user icon"/>
              </Row>
              <Row className="justify-content-md-center">
                <h2>Create an Account</h2>
              </Row>
              <Row className="justify-content-md-center">
              <h4 style={{ color: 'lightgrey' }}>Save licks you tab for later</h4>
              </Row>
              <Row className="justify-content-md-center">
                <Button variant="outline-dark" onClick={() => { }}>
                  Continue with Google
                </Button>
              </Row>
            </Col>
            <Col xs={6}>
              <Row className="justify-content-md-center">
                <img src={GuitarIcon} height={75} alt="guitar icon"/>
              </Row>
              <Row className="justify-content-md-center">
                <h2>Get Started</h2>
              </Row>
              <Row className="justify-content-md-center">
                  <h4 style={{ color: 'lightgrey' }}>Download tabs you create</h4>
              </Row>
              <Row className="justify-content-md-center">
                <Button variant="primary" onClick={() => { }}>
                  Start Tabbing
                </Button>
              </Row>
            </Col>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '50px'}}>
            <h1>3 Steps to Tabs</h1>
          </Row>
          <Row style={{marginTop: '50px'}}>
            <Col xs={4}>
              <Row className="justify-content-md-center">
                <img src={SingerIcon} height={150} alt="singer icon"/>
              </Row>
              <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
                <h2>Record</h2>
              </Row>
            </Col>
            <Col xs={4}>
              <Row className="justify-content-md-center">
                <img src={UploadIcon} height={150} alt="upload icon"/>
              </Row>
              <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
                <h2>Upload</h2>
              </Row>
            </Col>
            <Col xs={4}>
              <Row className="justify-content-md-center">
                <img src={SheetMusicIcon} height={150} alt="sheet music icon"/>
              </Row>
              <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
                <h2>View</h2>
              </Row>
            </Col>
          </Row>
          <Row style={{marginTop: '50px'}}>
            <Col xs={3}>
              <Row className="justify-content-md-center">
                <img src={VinylsIcon} height={150} alt="vinyls icon"/>
              </Row>
            </Col>
            <Col xs={2}>
              <Row className="justify-content-md-center">
                <h4 style={{ color: 'lightgrey' }}>Keep the licks you tab in your <b>library</b></h4>
              </Row>
            </Col>
            <Col xs={2}>
              <Row className="justify-content-md-center">
                <img src={FriendsIcon} height={150} alt="friends icon"/>
              </Row>
            </Col>
            <Col xs={2}>
              <Row className="justify-content-md-center">
                <h4 style={{ color: 'lightgrey' }}><b>Share</b> tabs with friends</h4>
              </Row>
            </Col>
            <Col xs={3}>
              <Row className="justify-content-md-center">
                <img src={LoveIcon} height={150} alt="heart icon"/>
              </Row>
            </Col>
          </Row>
          <Row style={{marginTop: '50px'}}>
            <Col xs={3}>
              <Row className="justify-content-md-center">
                <img src={ClockIcon} height={120} alt="clock icon"/>
              </Row>
            </Col>
            <Col xs={6}>
              <Row className="justify-content-md-center">
                <h2>Built to Save Musicians Time</h2>
              </Row>
              <Row className="justify-content-md-center">
                <h4 style={{ color: 'lightgrey' }}>For artists on the go</h4>
              </Row>
            </Col>
            <Col xs={3}>
              <Row className="justify-content-md-center">
                <img src={JoggingIcon} height={120} alt="jogging icon"/>
              </Row>
            </Col>
          </Row>
        </Container>
    )
}