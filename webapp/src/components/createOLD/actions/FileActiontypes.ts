export const UPDATE_FILE = "UPDATE_FILE";
export const DELETE_FILE = "DELETE_FILE";
export const UPDATE_METADATA = "UPDATE_METADATA";
export const CLEAR_FILESTATE = "CLEAR_FILESTATE";

interface UpdateFileType {
    type: typeof UPDATE_FILE
    payload: File
}

interface DeleteFileType {
    type: typeof DELETE_FILE
}

interface UpdateMetaDataType {
    type: typeof UPDATE_METADATA
}

interface ClearFileState {
    type: typeof CLEAR_FILESTATE
}

export type FileActionTypes = (
    UpdateFileType |
    DeleteFileType |
    UpdateMetaDataType |
    ClearFileState
    )