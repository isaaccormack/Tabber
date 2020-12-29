import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import Container from "react-bootstrap/Container";
import { Row, Col, Button } from "react-bootstrap";

import UserIcon from "../icons/user.svg"
import GuitarIcon from "../icons/electric-guitar.svg"
import ArrowTipDarkIcon from "../icons/arrow-tip-dark.svg"
import GoogleIcon from "../icons/google.svg"
import ArrowTipLightIcon from "../icons/arrow-tip-light.svg"
import SingerIcon from "../icons/singer.svg"
import ArrowIcon from "../icons/vp3.svg"
import UploadIcon from "../icons/file-upload.svg"
import SheetMusicIcon from "../icons/music-sheet.svg"
import VinylsIcon from "../icons/vinyls.svg"
import FriendsIcon from "../icons/friends.svg"
import LoveIcon from "../icons/love.svg"
import ClockIcon from "../icons/clock.svg"
import JoggingIcon from "../icons/jogging.svg"

// TODO: all font sizes in app could come down a little to better match the header font size (ie. Tabber icon)

// TODO: probably in App.tsx the user state is checked and it is decided whether this page is rendered or another one for auth users

// TODO: should scale down icon sizes based on page size to be more responsive
export default function LandingPage() {

  const [loginUrl, setLoginURL] = useState("");

  // TODO: probably need error handling on this... and this is duplicated code
  useEffect(() => {
    fetch("/api/loginUrl")
      .then(response => response.text())
      .then(data => setLoginURL(data));
  }, [loginUrl])

  // TODO: make Rows be centered by default
  return (
    <Container>
      <Row className="justify-content-md-center" style={{marginTop: '50px'}}>
        <h1>Play Licks, Get Tabs</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h3 style={{color: 'lightgrey'}}>Upload or record a lick, have it tabbed automatically</h3>
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
            <h4 style={{color: 'lightgrey'}}>Save licks your tabs for later</h4>
          </Row>
          <Row className="justify-content-md-center">
            <Button variant="outline-dark" style={{borderRadius: '20px'}} href={loginUrl}>
              <img src={GoogleIcon} height={20} alt="little arrow icon" style={{marginBottom: '2px'}}/>
              <span style={{marginLeft: '30px'}}> </span>
              {'Continue with Google '}
              <img src={ArrowTipDarkIcon} height={15} alt="little arrow icon" style={{marginLeft: '30px'}}/>
            </Button>

            {/*<Button variant="outline-dark" onClick={() => {*/}
            {/*}}>*/}
            {/*  Continue with Google*/}
            {/*</Button>*/}
            {/*<img src={GoogleSignInButton} alt={"google-sign-in-button"}/>*/}
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
            <h4 style={{color: 'lightgrey'}}>Download tabs you create</h4>
          </Row>
          <Row className="justify-content-md-center">
            {/* TODO: doesn't work on mobile */}
            {/* TODO: create button component */}
            <Button variant="primary" style={{borderRadius: '20px'}} onClick={() => {
            }}>
              <span style={{marginLeft: '50px'}}> </span>
              {'Start Tabbing '}
              <img src={ArrowTipLightIcon} height={15} alt="little arrow icon" style={{marginLeft: '30px'}}/>
            </Button>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center" style={{marginTop: '50px'}}>
        <h1>3 Steps to Tabs</h1>
      </Row>
      <Row style={{marginTop: '50px'}}>
        <Col xs={2}>
          <Row className="justify-content-md-center">
            <img src={SingerIcon} height={150} alt="singer icon"/>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
            <h2>Record</h2>
          </Row>
        </Col>
        <Col xs={3}>
          <Row className="justify-content-md-center" style={{marginTop: '100px'}}>
            <img src={ArrowIcon} height={150} alt="arrow icon" style={{opacity: 0.5}}/>
          </Row>
        </Col>
        <Col xs={2} style={{marginTop: '150px'}}>
          <Row className="justify-content-md-center">
            <img src={UploadIcon} height={150} alt="upload icon"/>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
            <h2>Upload</h2>
          </Row>
        </Col>
        <Col xs={3}>
          <Row className="justify-content-md-center" style={{marginTop: '250px'}}>
            <img src={ArrowIcon} height={150} alt="arrow icon" style={{opacity: 0.5}}/>
          </Row>
        </Col>
        <Col xs={2} style={{marginTop: '300px'}}>
          <Row className="justify-content-md-center">
            <img src={SheetMusicIcon} height={150} alt="sheet music icon"/>
          </Row>
          <Row className="justify-content-md-center" style={{marginTop: '10px'}}>
            <h2>View</h2>
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop: '100px'}}>
        <Col xs={2}>
          <Row className="justify-content-md-center">
            <img src={VinylsIcon} height={120} alt="vinyls icon"/>
          </Row>
        </Col>
        <Col xs={3} className="align-self-center">
          <Row className="justify-content-md-center">
            <h4 style={{color: 'lightgrey', textAlign: 'center'}}>Keep the licks you tab in your <span
              style={{fontWeight: 'bold', color: '#929292'}}>library</span></h4>
          </Row>
        </Col>
        <Col xs={2}>
          <Row className="justify-content-md-center">
            <img src={FriendsIcon} height={120} alt="friends icon"/>
          </Row>
        </Col>
        <Col xs={3} className="align-self-center">
          <Row className="justify-content-md-center">
            <h4 style={{color: 'lightgrey', textAlign: 'center'}}><span
              style={{fontWeight: 'bold', color: '#929292'}}>Share</span> tabs with friends</h4>
          </Row>
        </Col>
        <Col xs={2}>
          <Row className="justify-content-md-center">
            <img src={LoveIcon} height={120} alt="heart icon"/>
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop: '100px', marginBottom: '30px'}}>
        <Col xs={3}>
          <Row className="justify-content-md-center">
            <img src={ClockIcon} height={120} alt="clock icon"/>
          </Row>
        </Col>
        <Col xs={6} className="align-self-center">
          <Row className="justify-content-md-center">
            <h2>Built to Save Musicians Time</h2>
          </Row>
          <Row className="justify-content-md-center">
            <h4 style={{color: 'lightgrey'}}>For artists on the go</h4>
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