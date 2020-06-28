import {LickInterface} from "../../../library/component/LibraryTable";

export function getAudioFile(selected: LickInterface) {
    return fetch("/api/licks/audio/" + selected.id, {
        method: "GET"
    }).then((response) => {
        return response.blob();
    })
}