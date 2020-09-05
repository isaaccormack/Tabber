import React, {useEffect, useState} from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Figure from 'react-bootstrap/Figure';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import moment from 'moment';


import "./LibraryPage.css";
import LibraryTable from "./LibraryTable";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";
import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import RecordIcon from "../icons/record.svg";
import UploadIcon from "../icons/upload.svg";
import SharedWithIcon from "../icons/sharedWith.svg";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {UpdateFile} from "../../create/actions/FileActions";



export default function LibraryPage() {

    const history = useHistory();
    const dispatch = useDispatch();


    const [licks, setLicks] = useState<LickInterface[]>([])
    const [selected, setSelected] = useState<LickInterface>()
    const [selectedFile, setSelectedFile] = useState<Blob>()

    function getLibrary() {
        fetch("/api/user/licks", {
            method: "GET"
        }).then((response) => {
            if (response.status === 200) { //remove this later
                return response.json();
            }
        }).then((responseJson) => {
            if (responseJson) {
                setLicks(responseJson);
            }
        })
    }

    useEffect(() => {
        getLibrary();
    }, [])

    useEffect(() => {
        if (licks.length > 0) {
            getAudioFile(licks[0]).then((file: Blob) => {
                setSelectedFile(file);
            })
        }
    }, [licks])

    const onFileSelect = (fileList: FileList | null) => {
        if (fileList) {
            const file: File = fileList[0];
            dispatch(UpdateFile(file));
            history.push("/create/description");
        }
    }

    // could define a lick type
    const renderCard = (lick: any, index: number) => {
        let file: Blob;

        // getAudioFile(lick.id).then((file: Blob) => {
        //     setSelectedFile(file);
        // })

        console.log(lick)
        const dateUploaded = moment(lick.dateUploaded).format("h:mma MMM D YYYY");

        return (
            <Col>
                <Card border="secondary" style={{ width: '18rem', marginTop: 20 }}>
                    {/* <Card.Header>{lick.name}</Card.Header> */}
                    <Card.Body>
                        <Card.Title>{lick.name}</Card.Title>
                        <img src={SharedWithIcon} height={20} alt="shared with" style={{opacity: lick.sharedWith.length == 0 ? 0.6 : 1}}/>
                        <div className="dateUploaded">
                            {dateUploaded}
                        </div>
                        {/* NEED to allow only one player to play at a time */}
                        <LibraryPlayer audioFile={selectedFile} />
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    // could make this component below a common component to both library and shared pages
    return (
        <Container>
            {/* will need conditional rendering in this to render out sorting / other functionality */}
            <Nav className="justify-content-center" variant="tabs" defaultActiveKey="/library">
                <Nav.Item>
                    <Nav.Link href="/library">Library</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/shared">Shared</Nav.Link>
                </Nav.Item>
            </Nav>

            {licks.length == 0 ?
            
            <Container>
                <Row className="justify-content-center">
                    <h1 style={{marginTop: 70, marginBottom: 70, color: "#495057"}}>
                        You haven't created any licks
                    </h1>
                </Row>
                <Row>
                    <Col>
                        <a href="/create/record">
                        <Figure className="recordIcon">
                            <Figure.Image
                                width={171}
                                height={180}
                                alt="record"
                                src={RecordIcon}
                                />
                            <h1 style={{display: "flex", color: "#495057", justifyContent: "center"}}>Record</h1>
                        </Figure>
                        </a>
                    </Col>
                    <Col xs={1} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <h1 style={{color: "#495057"}}>OR</h1>
                    </Col>
                    <Col>
                    <label htmlFor={"upload"}>
                        <Figure  className="uploadIcon">
                            <Figure.Image
                                width={171}
                                height={180}
                                alt="upload"
                                src={UploadIcon}
                                />
                            <h1 style={{display: "flex", color: "#495057", justifyContent: "center"}}>Upload</h1>
                        </Figure>
                        </label>
                        <input id="upload"
                        type="file"
                        accept="audio/*"
                        onChange={(e) => onFileSelect(e.target.files)} />
                    </Col>
                </Row>
            </Container>
            :
            <Container>
                <Form>
                    <Form.Row className="justify-content-center" style={{marginTop: 20}}>
                        <Col xs={10}>
                            {/* TODO -> onChange, filter the licks, that is, just get every lick then only disp. the ones that match */}
                            <Form.Control type="text" placeholder="Search" onChange={() => {console.log("hello")}}/>
                        </Col>
                    </Form.Row>
                </Form>

                <Container>
                    <Row xs={2} md={3}>
                        {licks.map(renderCard)}
                    </Row>
                </Container>
            </Container>
            }
        </Container>
        // <Container>
        //     <Row>
        //         <Col xs={4}/>
        //         <Col xs={2} className="menu">
        //             Library
        //         </Col>
        //         <Col className="menu">
        //             Shared
        //         </Col>
        //     </Row>

        // </Container>
        // <div>
        //     <div className="library-table-wrapper centered">
        //         <div className="library-title">
        //             My Library
        //         </div>
        //         <div>
        //             <LibraryPlayer audioFile={selectedFile} />
        //         </div>
        //         <br />
        //         <LibraryTable licks={licks} selected={selected} setSelected={setSelected}/>
        //     </div>
        // </div>
    )
}