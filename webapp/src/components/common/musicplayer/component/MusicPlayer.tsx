import React from "react";
import ReactPlayer from "react-player";
import {useSelector} from "react-redux";
import RootState from "../../../../store/root-state";
import {useHistory} from "react-router";


export default function MusicPlayer() {
    const history = useHistory();
    const file: FileList | undefined = useSelector((state: RootState) => state.fileState.file);
    let audioPath = "";
    if (file) {
        try {
            audioPath = URL.createObjectURL(file[0]);
        } catch {
            console.log("Failed to get audio file");
        }
    }

    if (audioPath) {
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

