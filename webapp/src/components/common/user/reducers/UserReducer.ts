
import UserStateInterface from "./UserStateInterface";
import {DELETE_USER, UPDATE_USER} from "../actions/UserActionTypes";

const initialState: UserStateInterface = {user: undefined}
export default function UserReducer(
    state: UserStateInterface = initialState,
    action: any) {

    switch(action.type) {
        case UPDATE_USER:
            return {...state, user: action.payload};
        case DELETE_USER:
            return {...state, user: undefined};
        default:
            return {...state};
    }
}