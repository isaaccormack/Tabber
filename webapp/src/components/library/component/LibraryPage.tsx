import React, {useEffect, useState} from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Figure from 'react-bootstrap/Figure';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';
import DropdownButton from 'react-bootstrap/DropdownButton';
import moment from 'moment';


import "./LibraryPage.css";
import LibraryTable from "./LibraryTable";
import LibraryPlayer from "../../common/musicplayer/component/LibraryPlayer";
import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import RecordIcon from "../icons/record.svg";
import UploadIcon from "../icons/upload.svg";
import SquaresIcon from "../icons/whiteSquares.svg";
import LinesIcon from "../icons/whiteLines.svg";
import SortArrowAscIcon from "../icons/whiteSortArrowAsc.svg";
import SortArrowDescIcon from "../icons/whiteSortArrowDesc.svg";
import SharedWithIcon from "../icons/sharedWith.svg";
import TrashIcon from "../icons/trash.svg";
import PlayIcon from "../icons/play3.svg";
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";
import {UpdateFile} from "../../create/actions/FileActions";



export default function LibraryPage() {

    const history = useHistory();
    const dispatch = useDispatch();


    const [licks, setLicks] = useState<LickInterface[]>([])
    // const [selected, setSelected] = useState<LickInterface>()
    const [selectedFile, setSelectedFile] = useState<Blob>()
    const [sortBy, setSortBy] = useState('Date Created');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCards, setDisplayCards] = useState(true);
    const [ascending, setAscending] = useState(false);
    const [selected, setSelected] = useState<String[]>([]);

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

    // gunna need to add key to each card for delete
    const renderCard = (lick: LickInterface, index: number) => {
        let file: Blob;

        // getAudioFile(lick.id).then((file: Blob) => {
        //     setSelectedFile(file);
        // })

        console.log(lick)
        const dateUploaded = moment(lick.dateUploaded).format("h:mma MMM D YYYY");

        return (
            <Col>
                <Card className="lick-card">
                    {/* <Card.Header>{lick.name}</Card.Header> */}
                    <Card.Body>
                        <Row>
                            <Col xs={9}>
                                <Card.Title>{lick.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{dateUploaded}</Card.Subtitle>
                            </Col>
                            <Col>
                                <Form.Check onChange={handleSelected} checked={selected.includes(lick.id.toString())} id={lick.id.toString()} className="check-lick" type="checkbox" aria-label="option 1"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={3}>
                                <img src={SharedWithIcon} height={25} alt="shared with" style={{opacity: lick.sharedWith.length === 0 ? 0.6 : 1}}/>
                            </Col>
                            <Col xs={9} className="text-right">
                                <p style={{marginBottom: 0}}>{lick.tuning}</p>
                                <p style={{marginBottom: 0}}>{formatCapo(lick.capo)}</p>
                            </Col>
                        </Row>
                        <Row>
                            {/* align left */}
                            <Col xs={6}>
                                {/* <Row className="justify-content-left"> */}
                                    <img src={PlayIcon} height={70} alt="play lick"/>
                                {/* </Row> */}
                            </Col>
                            <Col xs={6} className="lick-length">
                                {/* <Row className="justify-content-end">  */}
                                    <h1 style={{marginBottom: 0}}>{formatLickLength(lick.audioLength)}</h1>
                                {/* </Row>  */}
                            </Col>
                        </Row>


                        {/* NEED to allow only one player to play at a time */}
                        {/* <LibraryPlayer audioFile={selectedFile} /> */}
                        
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    const renderCards = () => {
        const fliteredLicks = licks.sort((a: LickInterface, b: LickInterface): number => {
            let high = -1;
            if (ascending) {
                high = 1;
            }
            switch(sortBy) {
                case 'Date Created':
                    return (a.dateUploaded > b.dateUploaded) ? high : -high;
                case 'Length':
                    if (a.audioLength === b.audioLength) {
                        return (a.name.toLowerCase() > b.name.toLowerCase()) ? high : -high;
                    }
                    return (a.audioLength > b.audioLength) ? high : -high;
                default:
                    // default to title
                    return (a.name.toLowerCase() > b.name.toLowerCase()) ? high : -high;
            }
        })
        .filter((lick: LickInterface) => {
            return !searchQuery || lick.name.toLowerCase().indexOf(searchQuery) === 0;
        })
        .map(renderCard)

        if (fliteredLicks.length === 0) {
            return <h1>No Licks Found</h1>
        } else {
        return fliteredLicks;
        }
    }

    const formatLickLength = (length: number): string => {
        return length < 10 ? "0:0" + length.toString() :
                length < 60 ? "0:" + length.toString() : "1:00"
    }

    const formatCapo = (capo: number): string => {
        let formattedCapo = capo === 1 ? "1st" :
                capo === 2 ? "2nd" :
                capo === 3 ? "3rd" :
                capo === 4 ? "4th" :
                capo === 5 ? "5th" :
                capo === 6 ? "6th" :
                capo === 7 ? "7th" :
                capo === 8 ? "8th" :
                capo === 9 ? "9th" :
                capo === 10 ? "10th" :
                capo === 11 ? "11th" :
                capo === 12 ? "12th" : "No Capo"

        if (formattedCapo !== "No Capo") {
            formattedCapo += " fret"
        }

        return formattedCapo;
    }

    // gunna need a function to set lick state for each incoming lick to clean this repition up
    const renderTableRow = (lick: LickInterface, index: number) => {
        const dateUploaded = moment(lick.dateUploaded).format("h:mma MMM D YYYY");

        return (
            <tr>
                <td></td>
                <td>{lick.name}</td>
                <td>{formatLickLength(lick.audioLength)}</td>
                <td>{dateUploaded}</td>
                <td>{lick.tuning}</td>
                <td>{formatCapo(lick.capo)}</td>
                <td>
                    <img src={SharedWithIcon} height={20} alt="shared with" style={{opacity: lick.sharedWith.length === 0 ? 0.6 : 1}}/>
                </td>
            </tr>
        )
    }

    const renderTable = () => {
        return (
            <Table striped bordered hover style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Length</th>
                    <th>Date Created</th>
                    <th>Tuning</th>
                    <th>Capo</th>
                    <th>Shared</th>
                    </tr>
                </thead>
                <tbody>
                    {licks.map(renderTableRow)}
                </tbody>
            </Table>
        )
    }

    const handleSelected = (event: any) => {
        if (event.target.checked) {
            setSelected(selected.concat(event.target.id))
        } else {
            setSelected(selected.filter(e => e !== event.target.id))
        }
    }

    const handleSelectAll = (event: any) => {
        if (event.target.checked) {
            setSelected(licks.map(lick => lick.id.toString()));
        } else {
            setSelected([]);
        }
    }
    
    // could make this component below a common component to both library and shared pages
    return (
        <Container>
            {/* will need conditional rendering in this to render out sorting / other functionality */}
            <Nav variant="tabs" defaultActiveKey="/library">
                <div style={{display: "flex", justifyContent: "center", alignItems: "start", paddingTop: 20}}>

                <Nav.Item style={{padding: 10, marginLeft: 30}}>
                    <Form.Check onChange={handleSelectAll} checked={selected.length > 0} id="all" type="checkbox" aria-label="option 1"/>
                </Nav.Item>
                <Nav.Item style={{marginLeft: 2, padding: 10, pointerEvents: selected.length > 0 ? "all" : "none"}} id="sharedWithSelected">
                    <img style={{opacity: selected.length > 0 ? 0.8 : 0.6}}
                        height={27}
                        width={27}
                        alt="share with selected"
                        src={SharedWithIcon}
                        />
                </Nav.Item>
                <Nav.Item style={{marginLeft: 2, padding: 10, pointerEvents: selected.length > 0 ? "all" : "none"}} id="deleteSelected">
                    <img style={{opacity: selected.length > 0 ? 0.8 : 0.6}}
                        height={27}
                        width={27}
                        alt="delete selected"
                        src={TrashIcon}
                        />
                    </Nav.Item>
                </div>
                {/* <Nav className="justify-content-center"> */}
                {/* </Nav> */}
                <Nav className="ml-auto"/>
                    <Nav.Item style={{marginTop: 30}}>
                        <Nav.Link href="/library">Library</Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{marginTop: 30}}>
                        <Nav.Link href="/shared">Shared</Nav.Link>
                    </Nav.Item>
                <Nav className="mr-auto"/>
                    <Nav.Item>
                        {/* hacky fix to center nav links */}
                        <p style={{marginRight: 140}}></p>
                    </Nav.Item>
            </Nav>

            {licks.length === 0 ?
            
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
                        <Figure className="uploadIcon">
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
                <Row className="lick-display-control">
                    <Col xs={3} md={2}>
                        <Row className="justify-content-left">
                            <ButtonGroup aria-label="Basic example">
                                <Button onClick={() => {setDisplayCards(true)}} active={displayCards} variant="secondary">
                                    <img className="squares"
                                        height={23}
                                        width={23}
                                        alt="display licks as cards"
                                        src={SquaresIcon}
                                    />
                                </Button>
                                <Button onClick={() => {setDisplayCards(false)}} active={!displayCards} variant="secondary">
                                    <img className="lines"
                                        height={23}
                                        width={23}
                                        alt="display licks in table"
                                        src={LinesIcon}
                                    />
                                </Button>
                            </ButtonGroup>
                        </Row>
                    </Col>
                    <Col xs={4} sm={4} md={6} lg={7}>
                        <Form.Control type="text" placeholder="Search" onChange={(event: any) => {setSearchQuery(event.target.value)}}/>
                    </Col>
                    {displayCards &&
                        <Col xs={4} sm={5} md={4} lg={3}>
                            <Row className="justify-content-end"> 
                                <ButtonGroup className="right-align">
                                    <DropdownButton as={ButtonGroup} onSelect={(eventKey: string) => {setSortBy(eventKey)}} variant="secondary" id="dropdown-basic-button" title={sortBy}>
                                        <Dropdown.Item active={sortBy==="Date Created"} eventKey="Date Created">Date Created</Dropdown.Item>
                                        <Dropdown.Item active={sortBy==="Length"} eventKey="Length">Length</Dropdown.Item>
                                        <Dropdown.Item active={sortBy==="Title"} eventKey="Title">Title</Dropdown.Item>
                                    </DropdownButton>
                                    <Button onClick={() => {setAscending(!ascending)}} variant="secondary">
                                        <img className="sortArrow"
                                            height={17}
                                            width={17}
                                            alt="change order of sorting"
                                            src={ascending ? SortArrowAscIcon : SortArrowDescIcon}/>
                                    </Button>
                                </ButtonGroup>
                            </Row>
                        </Col>
                    }
                </Row>

                <Container>
                    {displayCards ? 
                        <Row xs={2} md={3}>
                            {renderCards()}
                        </Row>
                        :
                        <Row>
                            <Col>
                                {renderTable()}
                            </Col>
                        </Row>
                    }
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