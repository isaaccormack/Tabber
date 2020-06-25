export const BEGIN_RECORDING = "BEGIN_RECORDING";
export const STOP_RECORDING = "STOP_RECORDING";

interface BeginRecordingType {
    type: typeof BEGIN_RECORDING
}

interface StopRecordingType {
    type: typeof STOP_RECORDING
}


export type RecordStateActionTypes = (
    BeginRecordingType |
    StopRecordingType
    )