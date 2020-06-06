import NavigationStateInterface from "./NavigationStateInterface";
import {UPDATE_LOCATION} from "../actions/NavigationActionTypes";

const initialState: NavigationStateInterface = {location: "create", user: undefined}
export default function NavigationReducer(
    state: NavigationStateInterface = initialState,
    action: any) {

    switch(action.type) {
        case UPDATE_LOCATION:
            //todo
            return state;
        default:
            return {...state};
    }
}