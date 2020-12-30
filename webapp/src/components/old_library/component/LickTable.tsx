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
import {formatLickLength, formatCapo, formatDate} from "./FormattingHelpers"

export interface LickCardsProps {
    licks: LickInterface[];
    searchQuery: string;
    selected: string[];
    handleSelectOne: (event: any) => void;
}

export default function LickTable(props: LickCardsProps) {
    const licks = props.licks;
    // const searchQuery = props.searchQuery;
    const selected = props.selected;
    const handleSelectOne = props.handleSelectOne;

    const renderTableRow = (lick: LickInterface, index: number) => {
        return (
            <tr>
                <td></td>
                <td>{lick.name}</td>
                <td>{formatLickLength(lick.audioLength)}</td>
                <td>{formatDate(lick.dateUploaded)}</td>
                <td>{lick.tuning}</td>
                <td>{formatCapo(lick.capo)}</td>
                <td>
                    <img src={SharedWithIcon} height={20} alt="shared with" style={{opacity: lick.sharedWith.length === 0 ? 0.6 : 1}}/>
                </td>
            </tr>
        )
    }

    return (
        <Table striped bordered hover style={{ marginTop: 25 }}>
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