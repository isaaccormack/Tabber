import FileStateInterface from "./FileStateInterface";
import {CLEAR_FILESTATE, DELETE_FILE, UPDATE_FILE, UPDATE_METADATA} from "../actions/FileActiontypes";

const initialState: FileStateInterface = {
    file: undefined,
    metadata: undefined
}

export default function FileReducer(
    state: FileStateInterface = initialState,
    action: any) {

    switch(action.type) {
        case UPDATE_FILE:
            return {...state, file: action.payload};
        case UPDATE_METADATA:
            return {...state, metadata: action.payload};
        case DELETE_FILE:
            return {...state, file: undefined};
        case CLEAR_FILESTATE:
            return {undefined};
        default:
            return {...state};
    }
}