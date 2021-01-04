import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import TitleBlock from "./TitleBlock";
import ViewLickBlock from "./ViewLickBlock";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { useGetLick } from "../utils/useGetLick";
import { AlertInterface, useAlertTimeouts } from "../../common/utils/useAlertTimeouts";
import renderAlert from "../../common/utils/renderAlert";

export default function EditPage(props: any) {

  const [lick, setLick] = useState<LickInterface>();
  const [lickAudioURL, setLickAudioURL] = useState<string>();
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  useGetLick(props.match.params.id, setLick, setLickAudioURL, setAlert);
  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);

  if (lick) {
    return (
      <Container>
        {renderAlert(alert, setAlert)}
        <TitleBlock
          lickName={lick.name}
          isLickPublic={lick.isPublic}
          dateLickUploaded={lick.dateUploaded}
          lickAudioURL={lickAudioURL}
          isEditPage={false}
          lickAuthor={lick.owner.name}
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