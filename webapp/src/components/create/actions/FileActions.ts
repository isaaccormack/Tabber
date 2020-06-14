import {DELETE_FILE, FileActionTypes, UPDATE_FILE} from "./FileActiontypes";

export function UpdateFile(file: FileList) {
    return {
        type: UPDATE_FILE,
        payload: file
    }
}

export function DeleteFile(): FileActionTypes {
    return {
        type: DELETE_FILE
    }
}