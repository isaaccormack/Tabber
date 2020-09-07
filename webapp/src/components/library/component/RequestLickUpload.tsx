import React from "react";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Figure from 'react-bootstrap/Figure';
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";

import "./RequestLickUpload.css";
import RecordIcon from "../icons/record.svg";
import UploadIcon from "../icons/upload.svg";
import {UpdateFile} from "../../create/actions/FileActions";


export default function RequestLickUpload() {
    const history = useHistory();
    const dispatch = useDispatch();

    const handleFileSelect = (fileList: FileList | null) => {
        if (fileList) {
            const file: File = fileList[0];
            dispatch(UpdateFile(file));
            history.push("/create/description");
        }
    }

    return (       
        <Container>
            <Row> 
                <Col>
                    <h1 className="text-center no-licks">
                        You haven't created any licks
                    </h1>
                </Col>
            </Row>
            {/* text-center to center every child element horizonatally */}
            <Row className="text-center">
                <Col>
                    <a href="/create/record">
                    <Figure className="recordIcon">
                        <Figure.Image
                            width={171}
                            height={180}
                            alt="record"
                            src={RecordIcon}
                            />
                        <h1>Record</h1>
                    </Figure>
                    </a>
                </Col>
                <Col className="my-auto" xs="auto">
                    <h1>OR</h1>
                </Col>
                <Col>
                <label htmlFor={"upload"}>
                    <Figure className="uploadIcon">
                        <Figure.Image
                            width={171}
                            height={180}
                            alt="upload"
                            src={UploadIcon}
                            />
                        <h1>Upload</h1>
                    </Figure>
                    </label>
                    <input id="upload"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileSelect(e.target.files)} />
                </Col>
            </Row>
        </Container>
    )
}
