import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import TitleBlock from "../common/TitleBlock";
import ViewLickBlock from "../common/ViewLickBlock";
import { LickInterface } from "../../../common/lick/interface/LickInterface";
import { useGetLick, useGetLickAudio } from "../../utils/useGetLick";
import { AlertInterface, useAlertTimeouts } from "../../../common/utils/useAlertTimeouts";
import renderAlert from "../../../common/utils/renderAlert";
import "../common/LickPage.css";

export default function EditPage(props: any) {

  const [lick, setLick] = useState<LickInterface>();
  const [lickAudioURL, setLickAudioURL] = useState<string>();
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  useGetLick(props.match.params.id, setLick);
  useGetLickAudio(props.match.params.id, lick, setLickAudioURL, setAlert)
  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);

  // get lick as non auth user
  // if lick is public, return it, otherwise forbidden

  // get lick as auth user
  // on server
  // try to get lick,
  // server checks if 1. you are the owner, 2. the lick is public, or 3. your user id exists in the list of users this lick is shared with
  // if none of these 3, send back forbidden

  // useEffect(() => {
  //   if (lick) {
  //     if (user.id !== lick.owner.id) {
  //
  //     }
  //   }
  // }, [lick])

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