import { Row } from "react-bootstrap";
import React from "react";

export default function TitleBlock() {
  return (
    <>
      <Row style={{marginTop: '50px'}} className="justify-content-md-center">
        <h1 style={{color: '#444444', textAlign: 'center'}}>{'Record a Lick'}</h1>
      </Row>
      <Row className="justify-content-md-center">
        <h3 style={{color: '#929292', textAlign: 'center'}}>{'Play the guitar directly into your computer\'s microphone'}</h3>
      </Row>
      <Row style={{marginTop: '5px'}} className="justify-content-md-center">
        <h5 style={{color: 'lightgrey', textAlign: 'center'}}>{'Consider using an '}
          <span style={{fontWeight: 'bold', color: '#929292'}}>external microphone</span>
          {' for best results'}
        </h5>
      </Row>
    </>
  );
}
