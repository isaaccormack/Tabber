import { Col, Row } from "react-bootstrap";
import FileIcon from "../../icons/music-file.svg";
import TrashIcon from "../../../lick-pages/icons/trash.svg";
import React from "react";

export default function UploadFileCard(props: any) {

  const formatFileSize = (fileSize: number): string => {
    if (fileSize > 1024) { // Kb
      return Math.floor(fileSize / 1024) + " Kb";
    } else if (fileSize > 1024 * 1024) { // Mb
      return Math.floor(fileSize / 1024 / 1024) + " Mb";
    } else { // bytes
      return Math.floor(fileSize) + " bytes";
    }
  }

  return (
    <Row style={{marginTop: '130px', borderRadius: '10px'}}>
      <Col>
        <Row className="justify-content-md-end">
          <img style={{margin: '10px'}} src={FileIcon} height={80} alt="file icon"/>
        </Row>
      </Col>
      <Col xs="auto" className="align-self-center">
        <Row>
          <h5 style={{color: '#404040'}}>{props.file.name}</h5>
        </Row>
        <Row>
          <h6 style={{color: 'lightgrey'}}>{formatFileSize(props.file.size)}</h6>
        </Row>
      </Col>
      <Col className="align-self-center">
        <img
          style={{marginLeft: '50px'}}
          id="trash-icon"
          src={TrashIcon}
          height={40}
          alt="trash can icon"
          onClick={() => props.setFile(undefined)}
        />
      </Col>
    </Row>
  );
}