import {DELETE_USER, UPDATE_USER, UserActionTypes} from "./UserActionTypes";
import {UserInterface} from "../interface/UserInterface";


export function UpdateUser(user: UserInterface): UserActionTypes {
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