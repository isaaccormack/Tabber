import {Col, Container, Row} from "react-bootstrap";
import EditForm from "./EditForm";
import {LickInterface} from "../../../library/component/LibraryTable";
import React, {useEffect, useState} from "react";
import {match} from "react-router";
import {getAudioFile} from "../../musicplayer/component/MusicHelper";
import LibraryPlayer from "../../musicplayer/component/LibraryPlayer";

import "./EditPage.css";
import ShareForm from "./ShareForm";

interface EditFormProps {
    id: string
}

export default function EditPage(props: match<EditFormProps>) {
    const [lick, setLick] = useState<LickInterface>();
    const [lickAudio, setLickAudio] = useState<Blob>()

    const upload = () => {

    }

    useEffect(() => {
        // @ts-ignore //For some reason my IDE says that match doesn't exist but it does
        fetch("/api/licks/" + props.match.params.id, {method: "GET"})
            .then((response) => {
                if (response.status !== 200) {
                    setLick(undefined);
                    return;
                }
                return response.json();
            })
            .then((responseJson) => {
                setLick(responseJson);
                console.log(responseJson);
            });
    }, [])

    useEffect(() => {
        if (lick) {
            getAudioFile(lick).then((file: Blob) => {
                setLickAudio(file);
            })
        }
    }, [lick])


    if (lick) {
        return (
            <Container fluid className="edit-page-wrapper">
                <div className="edit-title">
                    Edit Your Lick
                </div>
                <Row>
                    <Col xs={6}>
                        <EditForm formTitle={lick.name} onSubmit={upload} defaultLick={lick}/>
                    </Col>
                    <Col xs={3}>
                        <ShareForm />
                    </Col>
                </Row>
                <br />
                <Row>
                    <LibraryPlayer audioFile={lickAudio} />
                </Row>
            </Container>
        )
    } else {
        return (
            <div>
                <div className="edit-title">
                Edit Your Lick
                </div>
            </div>
        )
    }

}