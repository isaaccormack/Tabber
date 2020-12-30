import React, { useEffect, useState } from "react";
import "./LandingPage.css";
import Container from "react-bootstrap/Container";
import { Row, Col, Button } from "react-bootstrap";

import UserIcon from "../icons/user.svg"
import GuitarIcon from "../icons/electric-guitar.svg"
import ArrowTipDarkIcon from "../icons/arrow-tip-dark.svg"
import GoogleIcon from "../icons/google.svg"
import SingerIcon from "../icons/singer.svg"
import ArrowIcon from "../icons/vp3.svg"
import UploadIcon from "../icons/file-upload.svg"
import SheetMusicIcon from "../icons/music-sheet.svg"
import VinylsIcon from "../icons/vinyls.svg"
import FriendsIcon from "../icons/friends.svg"
import LoveIcon from "../icons/love.svg"
import ClockIcon from "../icons/clock.svg"
import JoggingIcon from "../icons/jogging.svg"

import HomePage from "./HomePage"
import UserHomePage from "./UserHomePage";
import { UserInterface } from "../../common/user/interface/UserInterface";
import { useSelector } from "react-redux";
import RootState from "../../../store/root-state";
import NavigationCard from "./NavigationCard";
import NavigationButton from "./NavigationButton";
import TitleBlock from "./TitleBlock";

// TODO: all font sizes in app could come down a little to better match the header font size (ie. Tabber icon)

// TODO: should scale down icon sizes based on page size to be more responsive
export default function LandingPage() {

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  const [loginUrl, setLoginURL] = useState("");
  const [isLanding, setIsLanding] = useState(true);

  // TODO: probably need error handling on this... and this is duplicated code
  useEffect(() => {
    fetch("/api/loginUrl")
      .then(response => response.text())
      .then(data => setLoginURL(data));
  }, [loginUrl])

  function googleButton() {
    return (
      <Button variant="outline-dark" style={{borderRadius: '20px'}} href={loginUrl}>
        <img src={GoogleIcon} height={20} alt="little arrow icon" style={{marginBottom: '2px'}}/>
        <span style={{marginLeft: '5px'}}> </span>
        {'Continue with Google '}
        <img src={ArrowTipDarkIcon} height={15} alt="little arrow icon" style={{marginLeft: '5px'}}/>
      </Button>
    );
  }

  const renderLandingPage = () => {
    return (
      <Container>
        <TitleBlock title={"Play Licks, Get Tabs"} desc={"Upload or record a lick, have it tabbed automatically"}/>
        <Row style={{marginTop: '50px'}}>
          <Col xs={6}>
          <NavigationCard
            icon={UserIcon}
            iconHeight={75}
            name={"Create an Account"}
            desc={"Save licks you tab for later"}
            button={googleButton()}
          />
          </Col>
          <Col xs={6}>
            <NavigationCard
              icon={GuitarIcon}
              iconHeight={75}
              name={"Get Started"}
              desc={"Download tabs you create"}
              button={
                <NavigationButton
                  variant={"primary"}
                  desc={"Start Tabbing"}
                  onClick={() => {setIsLanding(false)}}
                />}
            />
          </Col>
        </Row>
        <Row style={{marginTop: '100px'}}>
          <h1>3 Steps to Tabs</h1>
        </Row>
        <Row>
          <Col xs={2}>
            <Row>
              <img src={SingerIcon} height={150} alt="singer icon"/>
            </Row>
            <Row style={{marginTop: '10px'}}>
              <h2>Record</h2>
            </Row>
          </Col>
          <Col xs={3}>
            <Row style={{marginTop: '100px'}}>
              <img src={ArrowIcon} height={150} alt="arrow icon" style={{opacity: 0.5}}/>
            </Row>
          </Col>
          <Col xs={2} style={{marginTop: '150px'}}>
            <Row>
              <img src={UploadIcon} height={150} alt="upload icon"/>
            </Row>
            <Row style={{marginTop: '10px'}}>
              <h2>Upload</h2>
            </Row>
          </Col>
          <Col xs={3}>
            <Row style={{marginTop: '250px'}}>
              <img src={ArrowIcon} height={150} alt="arrow icon" style={{opacity: 0.5}}/>
            </Row>
          </Col>
          <Col xs={2} style={{marginTop: '300px'}}>
            <Row>
              <img src={SheetMusicIcon} height={150} alt="sheet music icon"/>
            </Row>
            <Row style={{marginTop: '10px'}}>
              <h2>View</h2>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '100px'}}>
          <Col xs={2}>
            <Row>
              <img src={VinylsIcon} height={120} alt="vinyls icon"/>
            </Row>
          </Col>
          <Col xs={3} className="align-self-center">
            <Row>
              <h4 style={{color: 'lightgrey', textAlign: 'center'}}>Keep the licks you tab in your <span
                style={{fontWeight: 'bold', color: '#929292'}}>library</span></h4>
            </Row>
          </Col>
          <Col xs={2}>
            <Row>
              <img src={FriendsIcon} height={120} alt="friends icon"/>
            </Row>
          </Col>
          <Col xs={3} className="align-self-center">
            <Row>
              <h4 style={{color: 'lightgrey', textAlign: 'center'}}><span
                style={{fontWeight: 'bold', color: '#929292'}}>Share</span> tabs with friends</h4>
            </Row>
          </Col>
          <Col xs={2}>
            <Row>
              <img src={LoveIcon} height={120} alt="heart icon"/>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '100px', marginBottom: '30px'}}>
          <Col xs={3}>
            <Row>
              <img src={ClockIcon} height={120} alt="clock icon"/>
            </Row>
          </Col>
          <Col xs={6} className="align-self-center">
            <Row>
              <h2>Built to Save Musicians Time</h2>
            </Row>
            <Row>
              <h4 style={{color: 'lightgrey'}}>For artists on the go</h4>
            </Row>
          </Col>
          <Col xs={3}>
            <Row>
              <img src={JoggingIcon} height={120} alt="jogging icon"/>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }

  // note these <> can be used when we really dont need a wrapping component, ie. we would need a wrapping component for
  // css selection for example if we want to target children of tag, or just for common logical grouping stuff, ie. <li> tag
  return (
    <>
      {user ?
        <UserHomePage user={user}/>
      :
        <>
        {isLanding ?
          <>{renderLandingPage()}</>
        :
          <HomePage />
        }
        </>
      }
    </>
  )
}