import { combineReducers } from 'redux';
import NavigationReducer from "../components/common/header/reducers/NavigationReducer";
import UserReducer from "../components/common/user/reducers/UserReducer";
import FileReducer from "../components/createOLD/reducers/FileReducer";

const rootReducer = () => combineReducers({
    navigationState: NavigationReducer,
    userState: UserReducer,
    fileState: FileReducer
});

export default rootReducer;