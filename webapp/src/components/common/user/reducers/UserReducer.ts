
import UserStateInterface from "./UserStateInterface";
import {DELETE_USER, UPDATE_USER, UserActionTypes} from "../actions/UserActionTypes";
import {UserInterface} from "../interface/UserInterface";

interface UserActionInterface {
    type: string,
    payload: UserInterface | undefined
}

const initialState: UserStateInterface = {user: undefined}
export default function UserReducer(
    state: UserStateInterface = initialState,
    action: UserActionInterface) {

    switch(action.type) {
        case UPDATE_USER:
            return {...state, user: action.payload};
        case DELETE_USER:
            return {...state, user: undefined};
        default:
            return {...state};
    }
}