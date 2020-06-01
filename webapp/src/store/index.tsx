import { createStore, compose } from "redux"
import rootReducer from "./root-reducer";

// @ts-ignore
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;
const initialState = {}
const rootStore = createStore(rootReducer(), initialState, composeEnhancers());

export default rootStore;