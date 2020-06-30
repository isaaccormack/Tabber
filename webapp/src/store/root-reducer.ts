import { combineReducers } from 'redux';
import NavigationReducer from "../components/common/navigation/reducers/NavigationReducer";
import UserReducer from "../components/common/user/reducers/UserReducer";
import FileReducer from "../components/create/reducers/FileReducer";

const rootReducer = () => combineReducers({
    navigationState: NavigationReducer,
    userState: UserReducer,
    fileState: FileReducer,
});

export default rootReducer;