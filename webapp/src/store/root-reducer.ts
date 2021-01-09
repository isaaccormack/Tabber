import { combineReducers } from 'redux';
import UserReducer from "../components/common/user/reducers/UserReducer";

const rootReducer = () => combineReducers({ userState: UserReducer });

export default rootReducer;