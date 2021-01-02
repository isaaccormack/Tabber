import { Button, Col, Container, Row, Form, Alert } from "react-bootstrap";
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
import ReTabLickModal from "./ReTabLickModal";
import DetailsForm from "./DetailsForm";
import ReTabForm from "./ReTabForm";
import VisibilityForm from "./VisibilityForm";
import ShareForm from "./ShareForm";
import TitleBlock from "./TitleBlock";
import Modal from "react-bootstrap/Modal";


interface EditFormProps {
  id: string
}

interface AlertInterface {
  msg: string,
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light" | undefined;
}

export default function EditPage(props: match<EditFormProps>) {
  const [lick, setLick] = useState<LickInterface>();
  const [lickAudio, setLickAudio] = useState<Blob>()
  const [lickURL, setLickURL] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [icon, setIcon] = useState(PlayIcon);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showReTabModal, setShowReTabModal] = useState<boolean>(false);

  const [alert, setAlert] = useState<AlertInterface>();
  const [alertQueue, setAlertQueue] = useState<number>(0);


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

  // TODO: this should just chained onto first use effect
  useEffect(() => {
    if (lick) {
      getAudioFile(lick).then((file: Blob) => {
        setLickURL(URL.createObjectURL(file));
      })
    }
  }, [lick])

  const handleAudio = () => {
    setPlaying((playing) => !playing)
    setIcon((icon) => icon === PlayIcon ? PauseIcon : PlayIcon)
  }

  // theres a bug here when state changes while alert is still present it wont keep alert up for longer
  const renderAlert = () => {

    // this wont work, probably because of call stack issue, where this timeout doesnt get called until...
    // TODO: find another way to do this -> probably without a strategy like this, or just give up on this
    setTimeout(() => {
      console.log(alertQueue)
      if (alertQueue === 0) {
        setAlert(undefined)
      } else {
        setAlertQueue((queue) => queue--)
      }
    }, 5000);

    return (
      <Alert variant={alert!.variant} style={{marginTop: '5px'}} dismissible onClose={() => setAlert(undefined)}>
        {alert && alert.msg}
      </Alert>
    );
  }
  const incAlertQueue = () => {
    setAlertQueue((queue) => queue++);
  }

  if (lick) {
    return (
      <Container>
        {alert && renderAlert()}
        {/* TODO: think these are broken... */}
        <DeleteLickModal lickName={lick?.name}
                         showModal={showDeleteModal}
                         handleCloseModal={() => setShowDeleteModal(false)}
        />
        <ReTabLickModal lickName={lick?.name}
                        showModal={showReTabModal}
                        handleCloseModal={() => setShowReTabModal(false)}
        />
        <ReactPlayer
          style={{display: "none"}}
          url={lickURL}
          playing={playing}
          onEnded={() => { setPlaying(false); setIcon(PlayIcon)}}
        />
        <TitleBlock
          icon={icon}
          handleAudio={handleAudio}
          lickName={lick.name}
          isLickPublic={lick.isPublic}
          dateLickUploaded={lick.dateUploaded}
        />
        {/*<Row style={{marginTop: '30px', paddingLeft: "25px"}}>*/}
        {/*  <Col>*/}
        {/*    <Row>*/}
        {/*      <h5 style={{color: 'lightgrey'}}>{lick?.description}</h5>*/}
        {/*    </Row>*/}
        {/*  </Col>*/}
        {/*  <Col>*/}
        {/*    <Row style={{paddingRight: '30px'}} className="justify-content-md-end">*/}
        {/*      /!* TODO: add css to change opacity on hover *!/*/}
        {/*      <img id="pencil-icon" src={PencilIcon} height={25} alt="edit lick" style={{marginLeft: '20px'}}/>*/}
        {/*      <img id="trash-icon" src={TrashIcon} height={25} alt="delete lick" style={{marginLeft: '10px'}} onClick={() => setShowDeleteModal(true)}/>*/}
        {/*    </Row>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        {/*<Row style={{marginTop: '10px', paddingLeft: "25px"}}>*/}
        {/*    <Col>*/}
        {/*        <Row>*/}
        {/*          <h4 style={{color: 'grey'}}>{lick?.tuning + ' Tuning | ' + formatCapo(lick?.capo)}</h4>*/}
        {/*        </Row>*/}
        {/*    </Col>*/}
        {/*    <Col>*/}
        {/*        <Row style={{paddingRight: '30px'}} className="justify-content-md-end">*/}
        {/*          <h4 style={{color: 'grey'}}>Download Tabs</h4>*/}
        {/*          <img id="download-icon" src={DownloadIcon} height={25} alt="download tabs" style={{marginLeft: '10px'}}/>*/}
        {/*        </Row>*/}
        {/*    </Col>*/}
        {/*</Row>*/}

        {/* TODO: should not be passing setLick into each of these, should pass each a fcn they can call to hit api, that way set lick is kept in this component */}
        <Row style={{marginTop: '30px'}}>
          <Col>
            <DetailsForm
              setLick={setLick}
              setAlert={setAlert}
              lickId={lick.id}
              lickName={lick.name}
              lickDesc={lick.description}
            />
            <ReTabForm setShowReTabModal={setShowReTabModal}/>
          </Col>
          <Col>
            <VisibilityForm
              setLick={setLick}
              setAlert={setAlert}
              lickId={lick.id}
              isLickPublic={lick.isPublic}
            />
            <ShareForm
              setLick={setLick}
              setAlert={setAlert}
              incAlertQueue={incAlertQueue}
              lickId={lick.id}
              sharedWith={lick.sharedWith}
            />
          </Col>
        </Row>


        {/* END */}

        <Row>
            <Col>
                <h4 style={{color: 'grey', display: 'inline'}}>Download Tabs</h4>
                <img id="download-icon" src={DownloadIcon} height={25} alt="download tabs" style={{marginLeft: '10px', marginBottom: '5px'}}/>
            </Col>
            <Col>
              <Row className="justify-content-md-end" style={{marginRight: '0px', marginBottom: '5px'}}>
                <Button style={{marginRight: '20px'}} variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Tab</Button>
                <Button variant="secondary">Save Tab</Button>
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