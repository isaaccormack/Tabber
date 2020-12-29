import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import EnvelopeIcon from '../icons/envelope.svg'
import GitHubIcon from '../icons/github.svg'
import LinkedInIcon from '../icons/linkedin.svg'
import NoteIcon from '../icons/note.svg'
import { Link } from "react-router-dom";

export default function Footer() {

  // TODO: make this be at the bottom alwats
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
              <img src={EnvelopeIcon} height={22} alt="envelope icon" style={{marginLeft: '10px', opacity: 0.4}}/>
              <img src={GitHubIcon} height={22} alt="github icon" style={{marginLeft: '10px', opacity: 0.4}}/>
              <img src={LinkedInIcon} height={22} alt="linkedin icon" style={{marginLeft: '10px', opacity: 0.4}}/>
            </Row>
          </Col>
          <Col>
            <Row className="justify-content-md-end">
              <p style={{color: '#929292'}}><span style={{fontWeight: 'bold', color: '#929292'}}>1,200</span> licks tabbed</p>
              <img src={NoteIcon} height={22} alt="note icon" style={{marginLeft: '5px'}}/>
            </Row>
          </Col>
        </Row>
      </Container>
    )

}