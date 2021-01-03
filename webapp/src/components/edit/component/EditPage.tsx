import { Button, Col, Container, Row, Form, Alert } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { match, useHistory } from "react-router";
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
  location: any
}

interface AlertInterface {
  msg: string,
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light" | undefined;
}

export default function EditPage(props: any) {

  const history = useHistory();


  const [lick, setLick] = useState<LickInterface>();
  const [lickAudio, setLickAudio] = useState<Blob>()
  const [lickURL, setLickURL] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [icon, setIcon] = useState(PlayIcon);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showReTabModal, setShowReTabModal] = useState<boolean>(false);

  const [alert, setAlert] = useState<AlertInterface>();
  const [alertQueue, setAlertQueue] = useState<number>(0);

  const [lickDownloadURL, setLickDownloadURL] = useState<string>();

  const [tab, setTab] = useState<string>();

  const [tuning, setTuning] = useState<string>();
  const [capo, setCapo] = useState<number>();


  useEffect(() => {
    console.log(props.location)
    if (props.location.state && props.location.state.from === "404") {
      setAlert({msg: "Lick tabbed successfully!", variant: "success"})
      history.push({
        state: {
          from: ''
        }
      });
    }
  }, [])


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
        setTab(responseJson.tab);
        setTuning(responseJson.tuning);
        setCapo(responseJson.capo);
      });
    // @ts-ignore //again, typescript says match doesn't exist
  }, [props.match.params.id])

  // TODO: this should just chained onto first use effect
  useEffect(() => {
    if (lick) {
      getAudioFile(lick).then((file: Blob) => {
        setLickURL(URL.createObjectURL(file));
      })

      // save lick as downloadable txt file and set URL to download
      const myURL = window.URL || window.webkitURL //window.webkitURL works in Chrome and window.URL works in Firefox
      const blob = new Blob([lick.tab], { type: 'text/csv' });
      const csvUrl = myURL.createObjectURL(blob);
      setLickDownloadURL(csvUrl);
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

  // TODO: move this into component which is only rendered when lick exists so dont need lick!.id
  const updateTab = () => {
    fetch("/api/lick/update-tab/" + lick!.id, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newTab: tab
      })
    })
    // TODO: set alert that says cant update lick for some reason, ie. bad req, server error (maybe?)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Couldn\'t update lick');
      }
    })
    .then((responseJson) => {
      setAlert({msg: 'Tab saved!', variant: 'success'})
      setLick(responseJson);
      setTab(responseJson.tab);
    })
  }

  // TODO: move this into component which is only rendered when lick exists so dont need lick!.id
  const reTabLick = () => {
    history.push('/404'); // redirect to upload page instead

    fetch("/api/lick/re-tab/" + lick!.id, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newTuning: tuning,
        newCapo: capo
      })
    })
      // TODO: set alert that says cant update lick for some reason, ie. bad req, server error (maybe?)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Couldn\'t update lick');
        }
      })
      .then((responseJson) => {
        history.push({
            pathname: '/edit/' + responseJson.id,
            state: {
              from: '404'
            }
          });
      })
      .catch((error) => {
        history.push('/'); // redirect to error page eventually
        console.error(error)
      })
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
                        reTabLick={reTabLick}
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
            <ReTabForm
              initTuning={lick.tuning}
              tuning={tuning}
              setTuning={setTuning}
              initCapo={lick.capo}
              capo={capo}
              setCapo={setCapo}
              setShowReTabModal={setShowReTabModal}
            />
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
                <a download={lick.name + '.txt'} href={lickDownloadURL}>
                  <img id="download-icon" src={DownloadIcon} height={25} alt="download tabs" style={{marginLeft: '10px', marginBottom: '5px'}}/>
                </a>
            </Col>
            <Col>
              <Row className="justify-content-md-end" style={{marginRight: '0px', marginBottom: '5px'}}>
                <Button style={{marginRight: '20px'}} variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Tab</Button>
                <Button
                  // variant={tab === lick.tab ? "secondary" : "success"}
                  variant={"success"}
                  disabled={tab === lick.tab}
                  onClick={updateTab}>Save Tab</Button>
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
          <textarea
            className="lick-tab-field"
            value={tab ? tab : "No tab available"}
            onChange={(event) => setTab(event.target.value)}>
          </textarea>
        </Row>
      </Container>
    );
  } else {
    return <></>
  };
}