import RecordStateInterface from "./RecordStateInterface";
import {BEGIN_RECORDING, STOP_RECORDING} from "../actions/RecordActiontypes";

const initialState: RecordStateInterface = {recording: false}
export default function RecordReducer(
    state: RecordStateInterface = initialState,
    action: any) {

    switch(action.type) {
        case BEGIN_RECORDING:
            console.log("recording: true")
            return {...state, recording: true};
            case STOP_RECORDING:
                console.log("recording: false")
            return {...state, recording: false};
        default:
            return {...state};
    }
}