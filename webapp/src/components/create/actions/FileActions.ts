import {CLEAR_FILESTATE, DELETE_FILE, FileActionTypes, UPDATE_FILE, UPDATE_METADATA} from "./FileActiontypes";
import {LickFormInterface} from "../../edit/component/EditForm";

export function UpdateFile(file: FileList) {
    return {
        type: UPDATE_FILE,
        payload: file
    }
}

export function UpdateMetaData(data: LickFormInterface) {
    return {
        type: UPDATE_METADATA,
        payload: data
    }
}

export function DeleteFile(): FileActionTypes {
    return {
        type: DELETE_FILE
    }
}

export function ClearFileState() {
    return {
        type: CLEAR_FILESTATE
    }
}