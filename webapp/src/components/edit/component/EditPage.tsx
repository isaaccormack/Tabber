import {Col, Container, Row} from "react-bootstrap";
import EditForm from "./EditForm";
import React, {useEffect, useState} from "react";
import {match} from "react-router";
import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";

import "./EditPage.css";
import ShareForm from "./ShareForm";
import {LickInterface} from "../../common/lick/interface/LickInterface";

interface EditFormProps {
    id: string
}

export default function EditPage(props: match<EditFormProps>) {
    const [lick, setLick] = useState<LickInterface>();
    const [lickAudio, setLickAudio] = useState<Blob>()

    // must receieve the whole data and parse out whats needed here
    const submitEditLick = (data: any) => {

        fetch("/api/lick/" + lick!.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({newName: data.lickname, newDescription: data.lickdescription})
        })
        .then((response) => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Couldnt update lick');
            }
        })
        .then((responseJson) => {
            setLick(responseJson);
        })
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
            });
        // @ts-ignore //again, typescript says match doesn't exist
    }, [props.match.params.id])

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
                        <EditForm formTitle={lick.name} onSubmit={submitEditLick} defaultLick={lick} uploading={false}/>
                    </Col>
                    <Col xs={5}>
                        <ShareForm lick={lick} setLick={setLick}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <LibraryPlayer audioFile={lickAudio} />
                </Row>
                <br />
                <Row>
                    <Col xs={11}>
                        <textarea className="lick-tab-field">
                            {lick.tab ? lick.tab : "No tab available."}
                        </textarea>
                    </Col>
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