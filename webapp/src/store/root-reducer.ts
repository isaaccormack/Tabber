import { combineReducers } from 'redux';
import NavigationReducer from "../components/common/navigation/reducers/NavigationReducer";
import UserReducer from "../components/common/user/reducers/UserReducer";
import FileReducer from "../components/create/reducers/FileReducer";
import RecordReducer from "../components/create/reducers/RecordReducer";

const rootReducer = () => combineReducers({
    navigationState: NavigationReducer,
    userState: UserReducer,
    fileState: FileReducer,
    recordState: RecordReducer
});

export default rootReducer;