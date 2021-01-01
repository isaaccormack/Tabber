import {Button, Col, Container, Row, Modal} from "react-bootstrap";
import React, {useState} from "react";

import "./ShareFormOLD.css";
import {useForm} from "react-hook-form";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import {UserInterface} from "../../common/user/interface/UserInterface";

interface ShareFormProps {
    lick: LickInterface
    setLick: Function
}

interface ShareFormInterface {
    userToShare: string
}

export default function ShareFormOLD(props: ShareFormProps) {
    const { register, handleSubmit, errors } = useForm<ShareFormInterface>();
    const [userDoesntExistErr, setUserDoesntExistErr] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const submitShare = (data: ShareFormInterface) => {
        fetch("/api/lick/share/" + props.lick.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userEmail: data.userToShare})
        })
        .then((response) => {
            if (response.status !== 200) {
                setUserDoesntExistErr(true);
                return props.lick;
            }
            return response.json();
        })
        .then((responseJson) => {
            props.setLick(responseJson);
        })
    }

    const submitUnshare = (id: string | undefined) => {
        if (id) {
            fetch("/api/lick/unshare/" + props.lick.id, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userID: id})
            })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                props.setLick(responseJson);
            })
        }
    }

    const submitMakeLickPublic = (makePublic: boolean) => {
        fetch("/api/lick/" + props.lick.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({makePublic})
        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            props.setLick(responseJson);
        })
    }

    const renderSharedUsers = (lick: LickInterface) => {
        if (lick && lick.sharedWith) {
            return lick.sharedWith.map((user: UserInterface, i: number) => {
                return (
                    <Row className="share-text" key={i}>
                        <Col className="share-name" xs={5}>
                            {user.name}
                        </Col>
                        <Col xs={2}>
                            <Button
                                variant="danger"
                                onClick={() => { submitUnshare(user.id) }
                                }>
                                Remove
                            </Button>
                        </Col>
                    </Row>
                )
            })
        } else {
            return (
                <Row className="share-text">You haven't shared this yet</Row>
            )
        }
    }

    return (
        <Container fluid className="share-form-wrapper">
            <div className="share-form-title">
                Share
            </div>
            <input  type="text"
                    style={{width: '60%' }}
                    value={window.location.host + "/view/" + props.lick.id}
                    readOnly={true}
                    disabled={!props.lick.isPublic}
            />
            {props.lick.isPublic ? 
                <Button
                    style={{marginLeft: '10px'}}
                    variant="danger"
                    onClick={() => { handleShow() }
                    }>
                    Make Private
                </Button>
            :
                <Button
                    style={{marginLeft: '10px'}}
                    variant="success"
                    onClick={() => { submitMakeLickPublic(true) }
                    }>
                    Make Public
                </Button>
            
            }
            {renderSharedUsers(props.lick)}
            <form onSubmit={handleSubmit(submitShare)}>
                <div style={{marginTop: '5%'}}>
                    <Row className="form-row">
                        <Col xs={10}>
                            <input className="form-input"
                                name="userToShare"
                                placeholder="Enter users email"
                                ref={register({
                                    validate: (user: string) => {
                                        return user !== String(props.lick.owner.email);
                                        }
                                    })}
                                    onChange={() => {setUserDoesntExistErr(false)}}
                                    />
                            {errors.userToShare &&
                            <span className="share-text">You cannot share with yourself!</span>}
                            {userDoesntExistErr &&
                            <span className="share-text">User Doesn't Exist!</span>}
                        </Col>
                        <Col xs={2}>
                            <input type="submit" value="Share"/>
                        </Col>
                    </Row>
                </div>
            </form>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Make Private</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your public link will no longer work and users will lose access. <br/>
                    Are you sure you want to make this lick private?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Close
                    </Button>
                    <Button variant="danger" onClick={() => {handleClose(); submitMakeLickPublic(false)}}>
                    Make Private
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}