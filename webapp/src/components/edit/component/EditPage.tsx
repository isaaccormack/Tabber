import { Button, Col, Container, Row, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { match } from "react-router";
import { getAudioFile } from "../../common/musicplayer/component/MusicHelper";

import "./EditPage.css";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import {
  formatCapo,
  formatDate,
  formatDateNoTime,
  formatSumOfLickLengths
} from "../../library/component/FormattingHelpers";

import PauseIcon from "../icons/pause.svg"
import PlayIcon from "../icons/play.svg"
import PencilIcon from "../icons/pencil.svg"
import TrashIcon from "../icons/trash.svg"
import DownloadIcon from "../icons/download.svg"
import MusicPlayer from "../../common/musicplayer/component/MusicPlayer";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";
import ReactPlayer from "react-player";
import { Simulate } from "react-dom/test-utils";
import DeleteLickModal from "./DeleteLickModal";



interface EditFormProps {
  id: string
}

export default function EditPage(props: match<EditFormProps>) {
  const [lick, setLick] = useState<LickInterface>();
  const [lickAudio, setLickAudio] = useState<Blob>()
  const [lickURL, setLickURL] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [icon, setIcon] = useState(PlayIcon);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);


  // must receieve the whole data and parse out whats needed here
  const submitEditLick = (data: any) => {

    fetch("/api/lick/" + lick!.id, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newName: data.lickname,
        newDescription: data.lickdescription,
        newTuning: data.licktuning,
        newCapo: data.lickcapo
      })
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Couldnt update lick');
        }
      })
      .then((responseJson) => {
        setLick(responseJson);
      })
  }

  useEffect(() => {
    // @ts-ignore //For some reason my IDE says that match doesn't exist but it does
    fetch("/api/licks/" + props.match.params.id, {method: "GET"})
      .then((response) => {
        if (response.status !== 200) {
          setLick(undefined);
          return;
        }
        return response.json();
      })
      .then((responseJson) => {
        setLick(responseJson);
      });
    // @ts-ignore //again, typescript says match doesn't exist
  }, [props.match.params.id])

  useEffect(() => {
    if (lick) {
      getAudioFile(lick).then((file: Blob) => {
        setLickURL(URL.createObjectURL(file));
        // setLickAudio(file);
      })
    }
  }, [lick])

  const handleAudio = () => {
    setPlaying((playing) => !playing)
    setIcon((icon) => icon === PlayIcon ? PauseIcon : PlayIcon)
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  }
  if (lick) {
    return (
      <Container>
        <DeleteLickModal lickName={lick?.name}
                         showDeleteModal={showDeleteModal}
                         handleCloseDeleteModal={handleCloseDeleteModal}
        />
        <ReactPlayer url={lickURL} playing={playing} style={{display: "none"}} onEnded={() => { setPlaying(false); setIcon(PlayIcon) }}/>
        <Row style={{marginTop: '40px'}}>
          <Col xs={5} className="align-self-center">
            <Row className="justify-content-md-end">
              <img id="play-button" src={icon} height={100} alt="play lick audio" style={{marginRight: '20px'}} onClick={handleAudio}/>
            </Row>
          </Col>
          <Col xs={7} className="align-self-center">
            <Row>
              <h1 style={{color: '#404040'}}>{lick?.name}</h1>
            </Row>
            <Row>
              <Button disabled variant="danger" style={{opacity: 1}}>Private</Button>
              <h3 style={{color: 'grey', textAlign: 'center', marginLeft: '10px'}}>{lick && formatDateNoTime(lick.dateUploaded)}</h3>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '30px', paddingLeft: "25px"}}>
          <Col>
            <Row>
              <h5 style={{color: 'lightgrey'}}>{lick?.description}</h5>
            </Row>
          </Col>
          <Col>
            <Row style={{paddingRight: '30px'}} className="justify-content-md-end">
              {/* TODO: add css to change opacity on hover */}
              <img id="pencil-icon" src={PencilIcon} height={25} alt="edit lick" style={{marginLeft: '20px'}}/>
              <img id="trash-icon" src={TrashIcon} height={25} alt="delete lick" style={{marginLeft: '10px'}} onClick={() => setShowDeleteModal(true)}/>
            </Row>
          </Col>
        </Row>
        <Row style={{marginTop: '10px', paddingLeft: "25px"}}>
            <Col>
                <Row>
                  <h4 style={{color: 'grey'}}>{lick?.tuning + ' Tuning | ' + formatCapo(lick?.capo)}</h4>
                </Row>
            </Col>
            <Col>
                <Row style={{paddingRight: '30px'}} className="justify-content-md-end">
                  <h4 style={{color: 'grey'}}>Download Tabs</h4>
                  <img id="download-icon" src={DownloadIcon} height={25} alt="download tabs" style={{marginLeft: '10px'}}/>
                </Row>
            </Col>
        </Row>
        <Row>
          {/*<textarea className="lick-tab-field" onClick={() => {console.log("hello")}}>*/}
          {/*  {'e|----------------------------------------------------------------------------------------------------\n' +*/}
          {/*  'b|--------------------------------------2-2-5-5-5/7--7--5---7/10-10--7--10/12---12-10-----------------\n' +*/}
          {/*  'G|---4b6b4---2-----2-4b6b4--2-----------2-2-4-4-4/6--6---6--6/9--9----9--9/11---11---11--9--6/9--6--2-\n' +*/}
          {/*  'D|--4------4----4----------4-4-4p2--2h4---------------------------------------------------------------\n' +*/}
          {/*  'A|---------------------------------4------------------------------------------------------------------\n' +*/}
          {/*  'E|----------------------------------------------------------------------------------------------------'}*/}
          {/*  </textarea>*/}
          <textarea className="lick-tab-field" onClick={() => {console.log(lick?.tab)}}>
            {lick.tab ? lick.tab : "No tab available"}
          </textarea>
        </Row>
      </Container>
    );
  } else {
    return <></>
  };
}