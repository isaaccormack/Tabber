import { Container, Alert } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { match, useHistory } from "react-router";
import { getAudioFile } from "../../common/musicplayer/component/MusicHelper";

import "./EditPage.css";
import { LickInterface } from "../../common/lick/interface/LickInterface";

import TitleBlock from "./TitleBlock";
import ViewLickBlock from "./ViewLickBlock";
import TabForm from "./TabForm";
import EditForm from "./EditForm";


interface EditFormProps {
  id: string
  location: any
}

interface AlertInterface {
  msg: string,
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light" | undefined;
}

// TODO: fix alert messages... really
export default function EditPage(props: any) {

  const history = useHistory();

  const [lick, setLick] = useState<LickInterface>();
  const [lickAudioURL, setLickAudioURL] = useState<string>();
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState(); // dont know what to type this...
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  useEffect(() => {
    if (props.location.state && props.location.state.from === "404") {
      setAlert({msg: "Lick tabbed successfully!", variant: "success"})
      history.push({ state: { from: '' } });
    }
  }, [])


  // TODO: complete refactor of fetching from URL
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
  // I think this came from a misunderstanding that the audio could be changed for a lick
  useEffect(() => {
    if (lick) {
      getAudioFile(lick).then((file: Blob) => {
        setLickAudioURL(URL.createObjectURL(file));
      })
    }
  }, [lick])

  useEffect(() => {
    if (alert) {
      clearTimeout(alertTimeout); // will this break when param is null?

      const timeout = setTimeout(() => {
        setAlert(undefined);
      }, 5000);

      setAlertTimeout(timeout);
    }
  }, [alert])

  // theres a bug here when state changes while alert is still present it wont keep alert up for longer
  const renderAlert = () => {

    return (
      <Alert variant={alert!.variant} style={{marginTop: '5px'}} dismissible onClose={() => setAlert(undefined)}>
        {alert && alert.msg}
      </Alert>
    );
  }

  if (lick) {
    return (
      <Container>
        {alert && renderAlert()}
        <TitleBlock
          lickName={lick.name}
          isLickPublic={lick.isPublic}
          dateLickUploaded={lick.dateUploaded}
          lickAudioURL={lickAudioURL}
        />
        <ViewLickBlock
          lickName={lick.name}
          lickDesc={lick.description}
          lickTuning={lick.tuning}
          lickCapo={lick.capo}
          lickTab={lick.tab}
          showEditForm={showEditForm}
          setShowEditForm={setShowEditForm}
        />
        {showEditForm &&
          <EditForm
            setAlert={setAlert}
            setLick={setLick}
            lick={lick}
          />
        }
        <TabForm
          lickId={lick.id}
          lickName={lick.name}
          lickTab={lick.tab}
          setLick={setLick}
          setAlert={setAlert}
          showEditForm={showEditForm}
        />
      </Container>
    );
  } else {
    return <></>
  };
}