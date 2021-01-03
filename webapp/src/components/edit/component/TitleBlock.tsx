import { Button, Col, Row } from "react-bootstrap";
import { formatDateNoTime } from "../../library/component/FormattingHelpers";
import React, { useState } from "react";
import ReactPlayer from "react-player";
import PlayIcon from "../icons/play.svg";
import PauseIcon from "../icons/pause.svg";

export default function TitleBlock(props: any) {

  const [playing, setPlaying] = useState<boolean>(false);
  const [icon, setIcon] = useState(PlayIcon);

  const handleAudio = () => {
    setPlaying((playing) => !playing)
    setIcon((icon) => icon === PlayIcon ? PauseIcon : PlayIcon)
  }

  return (
    <>
      <ReactPlayer
        style={{display: "none"}}
        url={props.lickAudioURL}
        playing={playing}
        onEnded={() => { setPlaying(false); setIcon(PlayIcon)}}
      />

      <Row style={{marginTop: '40px'}}>
        <Col xs={5} className="align-self-center">
          <Row className="justify-content-md-end">
            <img
              style={{marginRight: '20px'}}
              id="play-button"
              src={icon}
              height={100}
              alt="play lick audio"
              onClick={handleAudio}
            />
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
            <h3
              style={{color: 'grey', textAlign: 'center', marginLeft: '10px'}}>
              {formatDateNoTime(props.dateLickUploaded)}
            </h3>
          </Row>
        </Col>
      </Row>
    </>
  );
}