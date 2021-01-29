import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import EnvelopeIcon from '../icons/envelope.svg'
import GitHubIcon from '../icons/github.svg'
import LinkedInIcon from '../icons/linkedin.svg'
import NoteIcon from '../icons/note.svg'
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import { throwFormattedError } from "../../utils/formattingHelpers";
import { LickInterface } from "../../lick-interface/LickInterface";

export default function Footer() {

  const [lickCount, setLickCount] = useState<number>();

  useEffect(() => {
    fetch("/api/lick-count", {
      method: "GET"
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        throwFormattedError('Lick count could not be retrieved', response.status, response.statusText);
      })
      .then((responseJson: any) => {
        if (responseJson.count === undefined) {
          throw new Error('No count attribute on response');
        }
        setLickCount(responseJson.count);
      })
      .catch((err) => console.error(err));
  }, [window.location.pathname]);

  const formatLickCount = (count: number | undefined): string => {
    if (count === undefined) return '';

    // from https://stackoverflow.com/a/2901298
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // TODO: make this be at the bottom always with same margin
    return (
      <Container>
        <Row style={{borderTop: 'solid', borderWidth: '1px', borderColor: 'lightgray', paddingTop: '15px', marginTop: '15px'}}>
          <Col>
            <Row>
              <p style={{color: '#929292'}}>© 2020 Tabber</p>
            </Row>
          </Col>
          <Col>
            <Row className="justify-content-md-center">
              <a href="https://github.com/isaacormack/Tabber" target="_blank">
                <img src={GitHubIcon} height={22} alt="github icon" style={{marginLeft: '10px', opacity: 0.4}}/>

              </a>
            </Row>
          </Col>
          <Col>
            <Row className="justify-content-md-end">
              <p style={{color: '#929292'}}><span style={{fontWeight: 'bold', color: '#929292'}}>{formatLickCount(lickCount)}</span> licks tabbed</p>
              <img src={NoteIcon} height={22} alt="note icon" style={{marginLeft: '5px'}}/>
            </Row>
          </Col>
        </Row>
      </Container>
    )

}