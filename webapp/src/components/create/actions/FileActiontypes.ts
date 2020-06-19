export const UPDATE_FILE = "UPDATE_FILE";
export const DELETE_FILE = "DELETE_FILE";
export const UPDATE_METADATA = "UPDATE_METADATA";

interface UpdateFileType {
    type: typeof UPDATE_FILE
    payload: FileList
}

interface DeleteFileType {
    type: typeof DELETE_FILE
}

interface UpdateMetaDataType {
    type: typeof UPDATE_METADATA
}

export type FileActionTypes = (
    UpdateFileType |
    DeleteFileType |
    UpdateMetaDataType
    )