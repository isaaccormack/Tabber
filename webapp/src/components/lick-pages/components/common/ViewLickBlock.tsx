import { Col, Row } from "react-bootstrap";
import PencilIcon from "../../icons/pencil.svg";
import TrashIcon from "../../icons/trash.svg";
import RemoveIcon from "../../icons/remove.svg";
import { formatCapo } from "../../../common/utils/formattingHelpers";
import React, { useState } from "react";
import DownloadTabsButton from "./DownloadTabsButton";
import DeleteLickModal from "../edit/DeleteLickModal";
import UnfollowLickModal from "../view/UnfollowLickModal";

export default function ViewLickBlock(props: any) {

  const lick = props.lick;

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState<boolean>(false);

  return (
    <>
      <DeleteLickModal
        lickId={lick.id}
        setAlert={props.setAlert}
        showModal={showDeleteModal}
        handleCloseModal={() => setShowDeleteModal(false)}
      />
      <UnfollowLickModal
        lickId={lick.id}
        setAlert={props.setAlert}
        showModal={showUnfollowModal}
        handleCloseModal={() => setShowUnfollowModal(false)}
      />

      <Row style={{marginTop: '15px', paddingLeft: "20px"}}>
        <Col xs={9}>
          {!props.showEditForm &&
            <Row>
              <h5 style={{color: 'lightgrey'}}>{lick.description}</h5>
            </Row>
          }
        </Col>
        {props.isEditPage ?
          <Col xs={3}>
            <Row style={{paddingRight: '40px'}} className="justify-content-md-end">
              <span className="modify-lick-span" onClick={() => props.setShowEditForm((showEditForm: boolean) => !showEditForm)}>
                <h4 style={{display: "inline", color: '#ffc107'}}>Edit</h4>
                <img
                  style={{marginLeft: '5px', marginRight: '20px'}}
                  src={PencilIcon}
                  height={25}
                  alt="edit lick"
                />
              </span>
              <span className="modify-lick-span" onClick={() => setShowDeleteModal(true)}>
                <h4 style={{display: "inline", color: '#dc3545'}}>Delete</h4>
                <img
                  style={{marginLeft: '5px'}}
                  src={TrashIcon}
                  height={25}
                  alt="delete lick"
                />
              </span>
            </Row>
          </Col>
          :
          <Col xs={3}>
            <Row style={{paddingRight: '30px'}} className="justify-content-md-end">
              <span className="modify-lick-span" onClick={() => setShowUnfollowModal(true)}>
                <h4 style={{display: "inline", color: '#dc3545'}}>Unfollow</h4>
                <img
                  style={{marginLeft: '5px'}}
                  src={RemoveIcon}
                  height={25}
                  alt="delete lick"
                />
              </span>
            </Row>
          </Col>
        }
      </Row>
      {!props.showEditForm &&
        <Row style={{marginTop: '10px', paddingLeft: "20px"}}>
          <Col>
            <Row>
              <h4 style={{color: 'grey'}}>
                {lick.tuning + ' Tuning | ' + formatCapo(lick.capo)}
              </h4>
            </Row>
          </Col>
          <Col>
            <Row style={{paddingRight: '30px'}} className="justify-content-md-end">
              <DownloadTabsButton
                lickName={lick.name}
                lickTab={lick.tab}
              />
            </Row>
          </Col>
        </Row>
      }
    </>
  );
}