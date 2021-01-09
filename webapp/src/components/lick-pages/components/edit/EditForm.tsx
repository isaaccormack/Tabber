import React from "react";
import { Col, Row } from "react-bootstrap";
import DetailsForm from "./DetailsForm";
import ReTabForm from "./ReTabForm";
import VisibilityForm from "./VisibilityForm";
import ShareForm from "./ShareForm";

export default function EditForm(props: any) {

  const lick = props.lick;

  return (
    <Row style={{marginTop: '5px'}}>
      <Col>
        <DetailsForm
          setLick={props.setLick}
          setAlert={props.setAlert}
          lickId={lick.id}
          lickName={lick.name}
          lickDesc={lick.description}
        />
        <ReTabForm
          lickName={lick.name}
          lickTuning={lick.tuning}
          lickCapo={lick.capo}
          lickId={lick.id}
        />
      </Col>
      <Col>
        <VisibilityForm
          setLick={props.setLick}
          setAlert={props.setAlert}
          lickId={lick.id}
          isLickPublic={lick.isPublic}
        />
        <ShareForm
          setLick={props.setLick}
          setAlert={props.setAlert}
          lickId={lick.id}
          sharedWith={lick.sharedWith}
        />
      </Col>
    </Row>
  );
}