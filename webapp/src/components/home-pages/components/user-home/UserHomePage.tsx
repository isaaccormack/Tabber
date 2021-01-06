import React from "react";
import { Col, Row } from "react-bootstrap";
import UploadIcon from "../../icons/file-upload.svg";
import MicrophoneIcon from "../../icons/microphone.svg";
import VinylsIcon from "../../icons/vinyls.svg";
import FriendsIcon from "../../icons/friends.svg";
import NavigationCard from "../common/NavigationCard";
import NavigationButton from "../common/NavigationButton";
import TitleBlock from "../common/TitleBlock";
import { useHistory } from "react-router";
import "../landing/LandingPage.css"


// TODO: type this, or find better way to just pass user as props
export default function UserHomePage(props: any) {
  const history = useHistory();
  const iconHeight: number = 150;

  return (
    <>
      <TitleBlock title={"Hello " + props.user.given_name} desc={"What would you like to do?"}/>
      <Row style={{marginTop: '50px'}}>
        <Col xs={6}>
          <NavigationCard
            icon={UploadIcon}
            iconHeight={iconHeight}
            name={"Upload"}
            desc={<>Upload a lick you've already <br /> saved on your computer</>}
            button={<NavigationButton
              variant={"primary"}
              desc={"Get Uploading"}
              onClick={() => history.push("/upload")}
            />}
          />
        </Col>
        <Col>
          <NavigationCard
            icon={MicrophoneIcon}
            iconHeight={iconHeight}
            name={"Record"}
            desc={<>Play a lick directly into your <br /> computers microphone</>}
            button={<NavigationButton
              variant={"warning"}
              desc={"Start Recording"}
              onClick={() => history.push("/record")}
            />}
          />
        </Col>
      </Row>
      <Row style={{marginTop: '50px', marginBottom: '50px'}}>
        <Col xs={6}>
          <NavigationCard
            icon={VinylsIcon}
            iconHeight={iconHeight}
            name={"Library"}
            desc={"View your library"}
            button={<NavigationButton
              variant={"success"}
              desc={"View Library"}
              onClick={() => history.push("/library")}
            />}
          />
        </Col>
        <Col>
          <NavigationCard
            icon={FriendsIcon}
            iconHeight={iconHeight}
            name={"Shared With"}
            desc={"View licks shared with you"}
            button={<NavigationButton
              variant={"info"}
              desc={"View Shared Licks"}
              onClick={() => history.push("/shared")}
            />}
          />
        </Col>
      </Row>
    </>
  )
}