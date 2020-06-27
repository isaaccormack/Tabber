import React, {useEffect, useState} from "react";
import {Container, Table} from "react-bootstrap";
import {sampleLicks} from "./tmp-sample-data";
import "./LibraryPage.css";
import LibraryTable, {LibraryTableProps, LickInterface} from "./LibraryTable";



export default function LibraryPage() {

    const [licks, setLicks] = useState<LickInterface[]>([])

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

    //TODO: add music player next to library title
    return (
        <div>
            <div className="library-table-wrapper centered">
                <div className="library-title">
                    My Library
                </div>
                <LibraryTable licks={licks} />
            </div>
        </div>
    )
}