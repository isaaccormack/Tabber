import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import TitleBlock from "./TitleBlock";
import GearIcon from "../../icons/gear.svg";
import {
  BeatLoader,
  BounceLoader,
  CircleLoader,
  ClimbingBoxLoader,
  ClipLoader, ClockLoader, DotLoader, GridLoader, HashLoader, MoonLoader,
  PacmanLoader, PuffLoader, PulseLoader, RingLoader, RiseLoader, SyncLoader
} from "react-spinners";

export default function UploadingPage() {

  const [loader, setLoader] = useState();

  const color = "#75a9f9";
  const scale = 5;

  const defaultSize = {
    'Beat': 15,
    'Bounce': 60,
    'Circle': 50,
    'ClimbingBox': 15,
    'Clip': 35,
    'Clock': 50,
    'Dot': 60,
    'Grid': 15,
    'Hash': 50,
    'Moon': 60,
    'Pacman': 25,
    'Puff': 60,
    'Pulse': 15,
    'Ring': 60,
    'Rise': 15,
    'Rotate': 15,
    'Sync': 15
  }

  const loaderComponents = [
    <BeatLoader size={scale * defaultSize['Beat']} color={color}/>,
    <BounceLoader size={scale * defaultSize['Bounce']} color={color}/>,
    <CircleLoader size={scale * defaultSize['Circle']} color={color}/>,
    <div style={{marginTop: '200px'}}><ClimbingBoxLoader size={scale * defaultSize['ClimbingBox']} color={color}/></div>,
    <ClipLoader size={scale * defaultSize['Clip']} color={color}/>,
    <ClockLoader size={scale * defaultSize['Clock']} color={color}/>,
    <DotLoader size={scale * defaultSize['Dot']} color={color}/>,
    <GridLoader size={scale * defaultSize['Grid']} color={color}/>,
    <HashLoader size={scale * defaultSize['Hash']} color={color}/>,
    <MoonLoader size={scale * defaultSize['Moon']} color={color}/>,
    <PacmanLoader size={scale * defaultSize['Pacman']} color={color}/>,
    <PuffLoader size={scale * defaultSize['Puff']} color={color}/>,
    <PulseLoader size={scale * defaultSize['Pulse']} color={color}/>,
    <RingLoader size={scale * defaultSize['Ring']} color={color}/>,
    <RiseLoader size={scale * defaultSize['Rise']} color={color}/>,
    <SyncLoader size={scale * defaultSize['Sync']} color={color}/>
  ]

  useEffect(() => {
    const random = Math.floor(Math.random() * loaderComponents.length);
    setLoader(loaderComponents[random]);
  }, [])

  useEffect(() => {
  }, [])

  return (
    <Container>
      <TitleBlock
        title="Uploading"
        marginRight="150px"
        desc="Please be patient, this may take a moment"
        icon={GearIcon}
        alt="gear icon"
      />

      <Row style={{marginTop: '150px'}} className="justify-content-md-center">
        {loader}
      </Row>
      {/* do conditional redirect based on where from initially, if state not set, redirect to home */}
      {/* should be a cancel button here */}
    </Container>
  );
}