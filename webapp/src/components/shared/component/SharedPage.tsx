import React, {useEffect, useState} from "react";

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
            getAudioFile(selected).then((file: Blob) => {
                setSelectedFile(file);
            })
        }
    }, [selected])

    console.log(licks);

    return (
        <div>
            <div className="shared-table-wrapper centered">
                <div className="shared-title">
                    Shared With Me
                </div>
                <div>
                    <LibraryPlayer audioFile={selectedFile} />
                </div>
                <br />
                <SharedTable licks={licks} selected={selected} setSelected={setSelected}/>
            </div>
        </div>
    )
}