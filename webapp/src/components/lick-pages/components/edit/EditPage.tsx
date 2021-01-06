import { Container } from "react-bootstrap";
import React, { useState } from "react";
import "../common/LickPage.css";
import { LickInterface } from "../../../common/lick/interface/LickInterface";

import TitleBlock from "../common/TitleBlock";
import ViewLickBlock from "../common/ViewLickBlock";
import TabForm from "./TabForm";
import EditForm from "./EditForm";
import { useGetLick, useGetLickAudio } from "../../utils/useGetLick";
import { AlertInterface, useAlertTimeouts } from "../../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../../common/utils/useRedirectAlerts";
import renderAlert from "../../../common/utils/renderAlert";

export default function EditPage(props: any) {

  const [lick, setLick] = useState<LickInterface>();
  const [lickAudioURL, setLickAudioURL] = useState<string>();
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();
  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  useGetLick(props.match.params.id, setLick);
  useGetLickAudio(props.match.params.id, lick, setLickAudioURL, setAlert)
  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);
  useRedirectAlerts(setAlert, "404", " was re-tabbed!", "success");

  if (lick) {
    return (
      <Container>
        {renderAlert(alert, setAlert)}
        <TitleBlock
          lickName={lick.name}
          isLickPublic={lick.isPublic}
          dateLickUploaded={lick.dateUploaded}
          lickAudioURL={lickAudioURL}
          isEditPage={true}
        />
        <ViewLickBlock
          lick={lick}
          showEditForm={showEditForm}
          setAlert={setAlert}
          setShowEditForm={setShowEditForm}
          isEditPage={true}
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
          lickTab={lick.tab ? lick.tab : "No tab available"}
          setLick={setLick}
          setAlert={setAlert}
          showEditForm={showEditForm}
        />
      </Container>
    );
  } else {
    return <></>
  }
}