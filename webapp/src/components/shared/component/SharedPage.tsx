import React, {useEffect, useState} from "react";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';


import "./SharedPage.css";
import SharedTable from "./SharedTable";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";
import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";

export default function SharedPage() {

    const [licks, setLicks] = useState<LickInterface[]>([]);
    const [selected, setSelected] = useState<LickInterface>()
    const [selectedFile, setSelectedFile] = useState<Blob>()

    function getLibrary() {
        fetch("/api/user/licks-shared-with-me", {
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
        if (selected) {
            getAudioFile(selected.id).then((file: Blob) => {
                setSelectedFile(file);
            })
        }
    }, [selected])

    console.log(licks);

    return (
        <Container>
            <Nav className="justify-content-center" variant="tabs" defaultActiveKey="/shared">
                <Nav.Item>
                    <Nav.Link href="/library">Library</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/shared">Shared</Nav.Link>
                </Nav.Item>
            </Nav>

            <Row className="justify-content-center">
                <h1 style={{marginTop: 70, marginBottom: 70, color: "#495057"}}>
                    No licks have been shared with you
                </h1>
            </Row>
        </Container>
        // <div>
        //     <div className="shared-table-wrapper centered">
        //         <div className="shared-title">
        //             Shared With Me
        //         </div>
        //         <div>
        //             <LibraryPlayer audioFile={selectedFile} />
        //         </div>
        //         <br />
        //         <SharedTable licks={licks} selected={selected} setSelected={setSelected}/>
        //     </div>
        // </div>
    )
}