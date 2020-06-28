import {LickInterface} from "../../lick/interface/LickInterface";

export function getAudioFile(selected: LickInterface) {
    return fetch("/api/licks/audio/" + selected.id, {
        method: "GET"
    }).then((response) => {
        return response.blob();
    })
}