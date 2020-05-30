import NavigationStateInterface from "./NavigationStateInterface";
import {DELETE_USER, UPDATE_LOCATION, UPDATE_USER} from "../actions/NavigationActionTypes";

const initialState: NavigationStateInterface = {location: "create", user: undefined}
export default function NavigationReducer(
    state: NavigationStateInterface = initialState,
    action: any) {

    switch(action.type) {
        case UPDATE_LOCATION:
            //todo
            return state;
        case UPDATE_USER:
            return {...state, user: action.payload};
        case DELETE_USER:
            return {...state, user: undefined};
        default:
            return {...state};
    }
}