import {match} from "react-router";
import React, {useEffect, useState} from "react";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";
import {Col, Container, Row} from "react-bootstrap";
import EditForm from "../../edit/component/EditForm";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";

interface ViewPageProps {
    id: string
}

export default function ViewPage(props: match<ViewPageProps>) {
    const [lick, setLick] = useState<LickInterface>();
    const [lickAudio, setLickAudio] = useState<Blob>()

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
                    Preview
                </div>
                <Row>
                    <Col xs={6}>
                        <EditForm formTitle={lick.name + " - " + lick.owner.name} onSubmit={() => {}} defaultLick={lick} disabled={true}/>
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
                            This is where the lick will go. It's blue because white was burning my eyeballs
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