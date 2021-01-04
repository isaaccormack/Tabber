import React, { useEffect, useState } from "react";
import { Alert, Container, Row } from "react-bootstrap";
import TitleBlock from "./TitleBlock";
import ViewLickBlock from "./ViewLickBlock";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { getAudioFile } from "../../common/musicplayer/component/MusicHelper";
import { useHistory } from "react-router";

interface AlertInterface {
  msg: string,
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light" | undefined;
}

export default function EditPage(props: any) {

  const history = useHistory();

  const [lick, setLick] = useState<LickInterface>();
  const [lickAudioURL, setLickAudioURL] = useState<string>();
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  // Attempt to fetch lick, then lick audio using lick id
  useEffect(() => {
    const lickId = props.match.params.id;

    fetch("/api/licks/" + lickId, {
      method: "GET"
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throw new Error('Lick could not be retrieved: ' + response.status + ' (' + response.statusText + ')');
      })
      .then((responseJson: LickInterface) => {
        setLick(responseJson);
        return responseJson.id;
      })
      .catch((err: Error) => {
        // TODO: redirect to error page eventually -- probably want to send err.message via history.state too
        history.push('/');
      })
      .then((lickId: number | void) => {
        return getAudioFile(lickId || -1)
      })
      .then((file: Blob) => {
        setLickAudioURL(URL.createObjectURL(file));
      })
      .catch((err: Error) => {
        setAlert({msg: err.message, variant: 'danger'})
      })
  }, [props.match.params.id])


  useEffect(() => {
    if (alert) {
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => { setAlert(undefined) }, 5000));
    }
  }, [alert])

  if (lick) {
    return (
      <Container>
        {alert &&
          <Alert
            style={{marginTop: '5px'}}
            dismissible
            variant={alert.variant}
            onClose={() => setAlert(undefined)}
          >
            {alert.msg}
          </Alert>
        }
        <TitleBlock
          lickName={lick.name}
          isLickPublic={lick.isPublic}
          dateLickUploaded={lick.dateUploaded}
          lickAudioURL={lickAudioURL}
          isEditPage={false}
        />
        <ViewLickBlock
          lick={lick}
          showEditForm={false}
          setAlert={setAlert}
          setShowEditForm={(props: any) => {}}
          isEditPage={false}
        />
        <Row>
          <textarea className="lick-tab-field" value={lick.tab ? lick.tab : "No tab available"} />
        </Row>
      </Container>
    );
  } else {
    return <></>;
  }
}