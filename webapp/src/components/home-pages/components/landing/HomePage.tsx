import React from "react";
import { Col, Row } from "react-bootstrap";
import UploadIcon from "../../icons/file-upload.svg";
import MicrophoneIcon from "../../icons/microphone.svg";

import NavigationCard from "../common/NavigationCard";
import NavigationButton from "../common/NavigationButton";
import TitleBlock from "../common/TitleBlock";
import { useHistory } from "react-router";

export default function HomePage() {
  const history = useHistory();
  const iconHeight = 200;

  // TODO: when you go back from either upload or record page, it brings you all the way back to landing page,
  //  but it should only bring you back to this page
  return (
    <>
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
      <Row style={{marginTop: '80px', marginBottom: '30px'}}>
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
    </>
  )
}