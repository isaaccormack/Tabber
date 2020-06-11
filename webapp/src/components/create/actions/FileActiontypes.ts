export const UPDATE_FILE = "UPDATE_FILE";
export const DELETE_FILE = "DELETE_FILE";

interface UpdateFileType {
    type: typeof UPDATE_FILE
    payload: FileList
}

interface DeleteFileType {
    type: typeof DELETE_FILE
}

export type FileActionTypes = (
    UpdateFileType |
    DeleteFileType
    )