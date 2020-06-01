import { combineReducers } from 'redux';
import NavigationReducer from "../components/common/navigation/reducers/NavigationReducer";

const rootReducer = () => combineReducers({
    navigationState: NavigationReducer
});

export default rootReducer;