import React, { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import DownloadTabsButton from "./DownloadTabsButton";

export default function TabForm(props: any) {

  const [tab, setTab] = useState<string>(props.lickTab);

  // TODO: move this into component which is only rendered when lick exists so dont need lick!.id
  const updateTab = () => {
    fetch("/api/lick/update-tab/" + props.lickId, {
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
        setTab(responseJson.tab);
        props.setAlert({msg: 'Tab saved!', variant: 'success'})
        props.setLick(responseJson);
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