import {BEGIN_RECORDING, STOP_RECORDING, RecordStateActionTypes} from "./RecordActiontypes";

export function BeginRecording(): RecordStateActionTypes {
    return {
        type: BEGIN_RECORDING,
    }
}

export function StopRecording(): RecordStateActionTypes {
    return {
        type: STOP_RECORDING,
    }
}
