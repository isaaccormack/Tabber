import React from "react";
import ReactPlayer from "react-player";
import {useSelector} from "react-redux";
import RootState from "../../../../store/root-state";
import {useHistory} from "react-router";


export default function MusicPlayer() {
    const history = useHistory();
    const file: File | undefined = useSelector((state: RootState) => state.fileState.file);
    let audioPath = "";
    if (file) {
        console.log(file)
        try {
            audioPath = URL.createObjectURL(file);
        } catch {
            console.log("Failed to get audio file");
        }
    }

    if (audioPath) {
        console.log(audioPath)
        return (
            <ReactPlayer url={audioPath}
                         controls={true}
                         config={{file: {forceAudio: true}}}
                         height={"50px"}
            />
        )
    } else {
        history.push("/create")
        return (
            <div>ERROR GETTING AUDIO</div>
        )
    }
}

