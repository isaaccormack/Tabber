import {match} from "react-router";
import React, {useEffect, useState} from "react";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";
import {Button, Col, Container, Row, Modal} from "react-bootstrap";
import EditFormOLD from "../../edit/component/EditFormOLD";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";
import {useHistory} from "react-router";

interface ViewPageProps {
    id: string
}

export default function ViewPage(props: match<ViewPageProps>) {
    const [lick, setLick] = useState<LickInterface>();
    const [lickAudio, setLickAudio] = useState<Blob>()

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const history = useHistory();

    const submitUnfollow = () => {
        fetch("/api/lick/unfollow/" + lick!.id, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.status === 204) {
                history.push('/shared');
            } else {
                // redirect to error page, just home for now
                console.error("Error: Couldn't unfollow")
                history.push('/create');           
            }
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
            getAudioFile(lick.id).then((file: Blob) => {
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
                        <EditFormOLD formTitle={lick.name + " - " + lick.owner.name} onSubmit={() => {}} defaultLick={lick} disabled={true} uploading={false}/>
                    </Col>
                    <Col xs={6}>
                        <Button
                            style={{marginLeft: '10px'}}
                            variant="danger"
                            onClick={() => { handleShow() } // call edit lick with args make public, need to build this endpoint
                            }>
                            Unfollow
                        </Button>
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

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Unfollow</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Your will no longer have access to this lick. <br/>
                        Are you sure you want unfollow?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                        Close
                        </Button>
                        <Button variant="danger" onClick={() => {handleClose(); submitUnfollow()}}>
                        Unfollow
                        </Button>
                    </Modal.Footer>
                </Modal>
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