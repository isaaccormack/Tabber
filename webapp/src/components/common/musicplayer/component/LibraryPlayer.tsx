import React, {useEffect, useState} from "react";
import ReactPlayer from "react-player";
import {useSelector} from "react-redux";
import RootState from "../../../../store/root-state";
import {useHistory} from "react-router";
import {LickInterface} from "../../../library/component/LibraryTable";

export interface LibraryPlayerProps {
    selectedFile?: Blob
}



export default function LibraryPlayer(props?: LibraryPlayerProps) {


    if (!props || !props.selectedFile) {
        return (<div>Please select a lick to player</div>);
    }

    let audioPath = "";
    if (props.selectedFile) {
        try {
            audioPath = URL.createObjectURL(props.selectedFile);
        } catch {
            return (<div>Failed to play the lick</div>);
        }
    }
    if (audioPath) {
        return (
            <ReactPlayer url={audioPath}
                         controls={true}
                         config={{file: {forceAudio: true}}}
                         height={"50px"}/>
        )
    } else {
        return (<div>Failed to play the lick</div>);
    }
}

