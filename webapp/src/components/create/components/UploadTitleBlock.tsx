import { Col, Row } from "react-bootstrap";
import UploadFileIcon from "../icons/upload-file.svg";
import React from "react";

export default function UploadTitleBlock(props:any) {
  return (
    <Row>
      <Col xs={8}>
        {/* TODO: maybe less margin on top here */}
        <Row style={{marginTop: '50px', marginRight: props.marginRight}} className="justify-content-md-end">
          <h1>{props.title}</h1>
        </Row>
        <Row className="justify-content-md-end">
          <h3 style={{color: 'lightgrey', textAlign: 'center'}}>{props.desc}</h3>
        </Row>
      </Col>
      <Col xs={4} className="align-self-end">
        <Row style={{marginLeft: '10px'}} className="justify-content-md-start">
          <img src={props.icon} height={120} alt={props.alt}/>
        </Row>
      </Col>
    </Row>
  );
}
