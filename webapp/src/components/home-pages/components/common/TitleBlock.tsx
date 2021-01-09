import { Row } from "react-bootstrap";
import React from "react";

export default function TitleBlock(props: any) {
  return (
    <>
      <Row style={{marginTop: '50px'}}>
        <h1>{props.title}</h1>
      </Row>
      <Row>
        <h3 style={{color: 'lightgrey', textAlign: 'center'}}>{props.desc}</h3>
      </Row>
    </>
  );
}