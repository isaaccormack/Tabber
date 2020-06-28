import {Button, Col, Container, Row} from "react-bootstrap";
import React from "react";

import "./ShareForm.css";
import {useForm} from "react-hook-form";
import {LickInterface} from "../../lick/interface/LickInterface";
import {UserInterface} from "../../user/interface/UserInterface";

interface ShareFormProps {
    lick: LickInterface
    setLick: Function
}

interface ShareFormInterface {
    userToShare: string
}

export default function ShareForm(props: ShareFormProps) {
    const { register, handleSubmit, errors } = useForm<ShareFormInterface>();

    const submitShare = (data: ShareFormInterface) => {
        fetch("/api/lick/share/" + props.lick.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userID: data.userToShare})
            })
            .then((response) => {
                if (response.status !== 200) {
                    return props.lick;
                }
                return response.json();
            })
            .then((responseJson) => {
                props.setLick(responseJson);
            })
    }

    const submitUnshare = (id: string) => {
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

    const renderSharedUsers = (lick: LickInterface) => {
        if (lick && lick.sharedWith) {
            return lick.sharedWith.map((user: UserInterface, i: number) => {
                return (
                    <Row className="share-text" key={i}>
                        <Col xs={5}>
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
            <form onSubmit={handleSubmit(submitShare)}>
                <Row className="form-row">
                    <Col xs={10}>
                        <input className="form-input"
                               name="userToShare"
                               placeholder="enter user"
                               ref={register({
                                   validate: user => user != props.lick.owner.id
                               })}
                        />
                        {errors.userToShare &&
                        <span className="share-text">You cannot share with yourself!</span>}
                    </Col>
                    <Col xs={2}>
                        <input type="submit" value="Share"/>
                    </Col>
                </Row>
            </form>
            {renderSharedUsers(props.lick)}
        </Container>
    )
}