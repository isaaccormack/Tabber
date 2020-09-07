import React from "react";
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';

import "./LickNav.css"
import {LickInterface} from "../../common/lick/interface/LickInterface";
import SharedWithIcon from "../icons/sharedWith.svg";
import TrashIcon from "../icons/trash.svg";
import UnfollowIcon from "../icons/unfollow.svg";

export interface LickNavProps {
    licks: LickInterface[];
    selectedLickIDs: string[];
    handleSelectAll: (e: any) => void;
    setShowShareModal: (a: boolean) => void;
    setShowDeleteModal: (a: boolean) => void;
    setShowUnfollowModal: (a: boolean) => void;
}


export default function LickNav(props: LickNavProps) {
    const licks = props.licks;
    const selectedLickIDs = props.selectedLickIDs;
    const handleSelectAll = props.handleSelectAll;
    const setShowShareModal = props.setShowShareModal;
    const setShowDeleteModal = props.setShowDeleteModal;
    const setShowUnfollowModal = props.setShowUnfollowModal;

    const anyLicksSelected: boolean = selectedLickIDs.length > 0;
    const location: string = window.location.pathname;

    return (
        <Nav variant="tabs" defaultActiveKey={location}>
            <div className="icon-box">
                <Nav.Item className="checkbox">
                    <Form.Check onChange={handleSelectAll}
                                checked={anyLicksSelected}
                                id="all"
                                type="checkbox"
                                />
                </Nav.Item>
                {location === "/library" ? 
                    <div style={{display: "flex"}}>
                        <Nav.Item onClick={() => {setShowShareModal(true)}}
                                className="icon"
                                style={{pointerEvents: anyLicksSelected ? "all" : "none"}}
                                >
                            <img style={{opacity: anyLicksSelected ? 0.8 : 0.6}}
                                height={27}
                                width={27}
                                alt="share with selected"
                                src={SharedWithIcon}
                                />
                        </Nav.Item>
                        <Nav.Item onClick={() => {setShowDeleteModal(true)}}
                                className="icon"
                                style={{pointerEvents: anyLicksSelected ? "all" : "none"}}
                                >
                            <img style={{opacity: anyLicksSelected ? 0.8 : 0.6}}
                                height={27}
                                width={27}
                                alt="delete selected"
                                src={TrashIcon}
                                />
                        </Nav.Item>
                    </div>
                    :
                    <Nav.Item onClick={() => {setShowUnfollowModal(true)}}
                              className="icon"
                              style={{pointerEvents: anyLicksSelected ? "all" : "none"}}
                              >
                        <img style={{opacity: anyLicksSelected ? 0.8 : 0.6}}
                            height={30}
                            width={30}
                            alt="unfollow selected"
                            src={UnfollowIcon}
                            />
                    </Nav.Item>
                }
            </div>
            <div className="central-nav">
                <Nav.Item>
                    <Nav.Link href="/library">Library</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/shared">Shared</Nav.Link>
                </Nav.Item>
            </div>
        </Nav>
    )
}
