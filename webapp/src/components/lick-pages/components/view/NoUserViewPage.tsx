import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useHistory } from "react-router";
import { LickInterface } from "../../../common/lick-interface/LickInterface";
import ConfettiIcon from "../../icons/confetti.svg"
import CelebrateIcon from "../../icons/celebrate.svg"
import DownloadWhiteIcon from "../../icons/download-white.svg"
import { useDownloadTabs } from "../common/useDownloadTabs";
import { useLoginURL } from "../../../common/header/components/useLoginURL";
import { formatCapo } from "../../../common/utils/formattingHelpers";

interface State {
  from: string | undefined,
  lick: LickInterface | undefined
}

export default function NoUserViewPage() {
  const history = useHistory();

  const state = history.location.state as State;

  const [lickDownloadURL, setLickDownloadURL] = useState<string>();
  const [loginURL, setLoginURL] = useState<string>();

  useDownloadTabs(state && state.lick ? state.lick.tab : "", setLickDownloadURL);
  useLoginURL(setLoginURL);

  // Can't access this page if not redirected to it such that lick is present in state
  if (!state || !state.lick) {
    history.push('/');
    return (<></>);
  }

  return (
    <Container>
      <Row>
        <Col>
          <Row className="justify-content-md-end">
            <img src={ConfettiIcon} height={100} alt="confetti icon"/>
          </Row>
        </Col>
        <Col xs="auto" style={{margin: '0px 20px'}}>
          <Row className="justify-content-md-center">
            <h1>View Tabs</h1>
          </Row>
          <Row className="justify-content-md-center">
            <a download={'mylick.txt'} href={lickDownloadURL}>
              <Button style={{paddingLeft: '30px', paddingRight: '30px'}} variant="success">
                Download your Tab
                <img style={{marginLeft: '10px', marginBottom: '2px'}} src={DownloadWhiteIcon} height={20} alt="download icon"/>
              </Button>
            </a>
          </Row>
          <Row className="justify-content-md-center">
            <h6 style={{marginTop: '10px', color: 'grey'}}>
              {'or '}
              <a
                style={{cursor: 'pointer', color: '#3d8af7', fontWeight: 'bold', textDecoration: 'underline'}}
                href={loginURL}
              >
                create an account
              </a>
              {' and save your licks'}
            </h6>
          </Row>
        </Col>
        <Col>
          <Row>
            <img src={CelebrateIcon} height={100} alt="celebrate icon"/>
          </Row>
        </Col>
      </Row>
      <Row style={{marginTop: '40px'}} className="justify-content-md-center">
        <h4 style={{color: 'grey'}}>
          {state.lick.tuning + ' Tuning | ' + formatCapo(state.lick.capo)}
        </h4>
      </Row>
      <Row>
        <textarea className="lick-tab-field" value={state.lick.tab ? state.lick.tab : "No tab available"} />
      </Row>
    </Container>
  );
}