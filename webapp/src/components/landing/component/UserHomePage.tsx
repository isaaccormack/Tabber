import React from "react";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import UploadIcon from "../icons/file-upload.svg";
import MicrophoneIcon from "../icons/microphone.svg";
import VinylsIcon from "../icons/vinyls.svg";
import FriendsIcon from "../icons/friends.svg";
import NavigationCard from "./NavigationCard";
import NavigationButton from "./NavigationButton";
import TitleBlock from "./TitleBlock";


// TODO: type this, or find better way to just pass user as props
export default function UserHomePage(props: any) {
  const iconHeight: number = 150;

  return (
    <Container>
      <TitleBlock title={"Hello " + props.user.given_name} desc={"What would you like to do?"}/>
      <Row style={{marginTop: '50px'}}>
        <Col xs={6}>
          <NavigationCard
            icon={UploadIcon}
            iconHeight={iconHeight}
            name={"Upload"}
            desc={<>Upload a lick you've already <br /> saved on your computer</>}
            button={<NavigationButton variant={"primary"} desc={"Get Uploading"}/>}
          />
        </Col>
        <Col>
          <NavigationCard
            icon={MicrophoneIcon}
            iconHeight={iconHeight}
            name={"Record"}
            desc={<>Play a lick directly into your <br /> computers microphone</>}
            button={<NavigationButton variant={"warning"} desc={"Start Recording"}/>}
          />
        </Col>
      </Row>
      <Row style={{marginTop: '50px'}}>
        <Col xs={6}>
          <NavigationCard
            icon={VinylsIcon}
            iconHeight={iconHeight}
            name={"Library"}
            desc={"View your library"}
            button={<NavigationButton variant={"success"} desc={"View Library"}/>}
          />
        </Col>
        <Col>
          <NavigationCard
            icon={FriendsIcon}
            iconHeight={iconHeight}
            name={"Shared With"}
            desc={"View licks shared with you"}
            button={<NavigationButton variant={"info"} desc={"View Shared Licks"}/>}
          />
        </Col>
      </Row>
    </Container>
  )
}