import {DELETE_USER, NavigationActionTypes, UPDATE_LOCATION, UPDATE_USER} from "./NavigationActionTypes";


export function UpdateLocation(): NavigationActionTypes {
    return {
        type: UPDATE_LOCATION
    }
}

export function UpdateUser(user: string): NavigationActionTypes {
    return {
        type: UPDATE_USER,
        payload: user
    }
}

export function DeleteUser(): NavigationActionTypes {
    return {
        type: DELETE_USER
    }
}