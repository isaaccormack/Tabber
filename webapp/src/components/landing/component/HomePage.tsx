import React from "react";
import Container from "react-bootstrap/Container";
import { Col, Row } from "react-bootstrap";
import UploadIcon from "../icons/file-upload.svg";
import MicrophoneIcon from "../icons/microphone.svg";

import NavigationCard from "./NavigationCard";
import NavigationButton from "./NavigationButton";
import TitleBlock from "./TitleBlock";

export default function HomePage() {
  const iconHeight = 200;

  return (
    <Container>
      <TitleBlock title={"Start Tabbing"} desc={
        <>
          Tabber is only able to process licks in which a
          <span style={{fontWeight: 'bold', color: '#929292'}}>{' single note '}</span>
          is played at a time <br/>
          Double stops and chords
          <span style={{fontWeight: 'bold', color: '#929292'}}>{' can not '}</span>
          be tabbed
        </>}
      />
      <Row style={{marginTop: '150px'}}>
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
    </Container>
  )
}