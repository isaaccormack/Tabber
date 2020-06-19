import React, {useEffect, useState} from "react";
import {Table} from "react-bootstrap";
import {sampleLicks} from "./tmp-sample-data";
import "./LibraryPage.css";

interface LickInterface {
    id: number
    name: string
    description: string
    dateUploaded: string
    audioFileLocation: string
    audioLength: string
    tab: string,
    tuning: string
    isPublic: boolean,
    owner: any
}

export default function LibraryPage() {

    const [licks, setLicks] = useState([{}])

    function getLibrary() {
        fetch("/api/user/licks", {
            method: "GET"
        }).then((response) => {
            if (response.status !== 200) { //remove this later
                setLicks(sampleLicks);
            } else {
                // need to integrate with api later
            }

        })
    }

    function renderTableBody(data: any) {
        console.log(data);
        if (data) {
            return data.map((lick: LickInterface, i: number) => {
                return (
                    <tr>
                        <td>{i}</td>
                        <td>{lick.name}</td>
                        <td>{lick.audioLength}</td>
                        <td>{lick.dateUploaded}</td>
                    </tr>
                )
            })
        }
        return {}
    }

    useEffect(() => {
        getLibrary();
    }, [getLibrary])

    return (
        <div>
            <div className="library-title">
                My Library
            </div>
            <Table striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Lick Name</th>
                        <th>Length</th>
                        <th>Uploaded</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody(licks)}
                </tbody>
            </Table>
        </div>
    )
}