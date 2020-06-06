import { combineReducers } from 'redux';
import NavigationReducer from "../components/common/navigation/reducers/NavigationReducer";
import UserReducer from "../components/common/user/reducers/UserReducer";

const rootReducer = () => combineReducers({
    navigationState: NavigationReducer,
    userState: UserReducer
});

export default rootReducer;