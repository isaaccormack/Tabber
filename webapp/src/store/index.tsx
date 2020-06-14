import { createStore, compose } from "redux"
import rootReducer from "./root-reducer";

function saveState(state: any) {
    localStorage.setItem("state", JSON.stringify(state))
}

function loadState() {
    try {
        const storedState = localStorage.getItem("state");
        if (storedState === null) return undefined;
        return JSON.parse(storedState);
    } catch {
        return undefined;
    }
}

// @ts-ignore
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;
const rootStore = createStore(rootReducer(), loadState(), composeEnhancers());

// subscribe to save state changes
rootStore.subscribe(() => saveState(rootStore.getState()));

export default rootStore;