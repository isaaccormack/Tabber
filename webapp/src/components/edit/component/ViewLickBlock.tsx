import { Col, Row } from "react-bootstrap";
import PencilIcon from "../icons/pencil.svg";
import TrashIcon from "../icons/trash.svg";
import { formatCapo } from "../../library/component/FormattingHelpers";
import React, { useState } from "react";
import DownloadTabsButton from "./DownloadTabsButton";
import DeleteLickModal from "./DeleteLickModal";

export default function ViewLickBlock(props: any) {

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <>
      <DeleteLickModal showModal={showDeleteModal}
                       handleCloseModal={() => setShowDeleteModal(false)}
      />

      <Row style={{marginTop: '15px', paddingLeft: "20px"}}>
        <Col xs={9}>
          {!props.showEditForm &&
            <Row>
              <h5 style={{color: 'lightgrey'}}>{props.lickDesc}</h5>
            </Row>
          }
        </Col>
        <Col xs={3}>
          <Row style={{paddingRight: '30px'}} className="justify-content-md-end">
            <h4 style={{display: "inline", color: '#ffc107'}}>Edit</h4>
            <img
              style={{marginLeft: '5px', marginRight: '20px'}}
              id="pencil-icon"
              src={PencilIcon}
              height={25}
              alt="edit lick"
              onClick={() => props.setShowEditForm((showEditForm: boolean) => !showEditForm)}
            />
            <h4 style={{display: "inline", color: '#dc3545'}}>Delete</h4>
            <img
            style={{marginLeft: '5px'}}
            id="trash-icon"
            src={TrashIcon}
            height={25}
            alt="delete lick"
            onClick={() => setShowDeleteModal(true)}
          />
          </Row>
        </Col>
      </Row>
      {!props.showEditForm &&
        <Row style={{marginTop: '10px', paddingLeft: "20px"}}>
          <Col>
            <Row>
              <h4 style={{color: 'grey'}}>
                {props.lickTuning + ' Tuning | ' + formatCapo(props.lickCapo)}
              </h4>
            </Row>
          </Col>
          <Col>
            <Row style={{paddingRight: '30px'}} className="justify-content-md-end">
              <DownloadTabsButton
                lickName={props.lickName}
                lickTab={props.lickTab}
              />
            </Row>
          </Col>
        </Row>
      }
    </>
  );
}