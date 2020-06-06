import {DELETE_USER, UPDATE_USER, UserActionTypes} from "./UserActionTypes";


export function UpdateUser(user: string): UserActionTypes {
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export function DeleteUser(): UserActionTypes {
    return {
        type: DELETE_USER
    }
}