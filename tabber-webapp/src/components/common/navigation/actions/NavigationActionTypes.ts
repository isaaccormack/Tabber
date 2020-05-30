export const UPDATE_LOCATION = "UPDATE_LOCATION";
export const UPDATE_USER = "UPDATE_USER";
export const DELETE_USER = "DELETE_USER";

interface UpdateLocationType {
    type: typeof UPDATE_LOCATION
}

interface UpdateUserType {
    type: typeof UPDATE_USER
    payload: string
}

interface DeleteUserType {
    type: typeof DELETE_USER
}

export type NavigationActionTypes = (
    UpdateLocationType |
    UpdateUserType |
    DeleteUserType
)