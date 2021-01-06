import {CLEAR_FILESTATE, DELETE_FILE, FileActionTypes, UPDATE_FILE, UPDATE_METADATA} from "./FileActiontypes";

export interface LickFormInterface {
    lickname: string
    lickdescription: string
    licktuning: string
    lickcapo: number
    lickpublic: boolean
}

export function UpdateFile(file: File) {
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