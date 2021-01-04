import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DownloadTabsButton from "../common/DownloadTabsButton";
import { LickInterface } from "../../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../../common/utils/formattingHelpers";

export default function TabForm(props: any) {

  const [tab, setTab] = useState<string>(props.lickTab);

  const updateTab = () => {
    fetch("/api/lick/update-tab/" + props.lickId, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tab })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Tab could not be updated', response.status, response.statusText);
    })
    .then((responseJson: LickInterface) => {
      props.setAlert({msg: 'Tab updated!', variant: 'success'})
      props.setLick(responseJson);
    })
    .catch((err: Error) => {
      props.setAlert({msg: err.message, variant: 'danger'})
    })
  }

  return (
    <>
      {props.showEditForm &&
      <Row>
        <Col>
          <DownloadTabsButton lickName={props.lickName} lickTab={props.lickTab}/>
        </Col>
        <Col>
          <Row className="justify-content-md-end" style={{marginRight: '0px', marginBottom: '5px'}}>
            <Button
              style={{marginRight: '10px'}}
              variant={"danger"}
              disabled={tab === props.lickTab}
              onClick={() => setTab(props.lickTab)}
            >
              Reset
            </Button>
            <Button variant={"success"} disabled={tab === props.lickTab} onClick={updateTab}>
              Save Tab
            </Button>
          </Row>
        </Col>
      </Row>
      }
      <Row>
        <textarea
          className="lick-tab-field"
          value={tab ? tab : "No tab available"}
          onChange={(event) => setTab(event.target.value)}>
        </textarea>
      </Row>
    </>
  );
}