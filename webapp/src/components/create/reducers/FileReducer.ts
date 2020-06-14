import FileStateInterface from "./FileStateInterface";
import {DELETE_FILE, UPDATE_FILE} from "../actions/FileActiontypes";

const initialState: FileStateInterface = {file: undefined}
export default function FileReducer(
    state: FileStateInterface = initialState,
    action: any) {

    switch(action.type) {
        case UPDATE_FILE:
            return {...state, file: action.payload};
        case DELETE_FILE:
            return {...state, file: undefined};
        default:
            return {...state};
    }
}