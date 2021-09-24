import {combineReducers} from 'redux';
import {DISMISS_ALERT, RECEIVE_COLORS, SET_ADMIN, SET_ALERT, SET_TAB, TAB_SKUS} from "../constants";

const alerts = (state = [], action) => {
    const {type, alert, id}  = action;
    switch (type) {
    case SET_ALERT:
        return [...state, {...alert, id: new Date().valueOf()}];
    case DISMISS_ALERT:
        return [...state.filter(alert => alert.id !== id)];
    default:
        return state;
    }
};

const currentTab = (state = TAB_SKUS.path, action) => {
    const {type, tab} = action;
    switch (type) {
    case SET_TAB:
        return tab;
    default:
        return state;
    }
};

const isAdmin = (state = false, action) => {
    const {type, isAdmin} = action;
    switch (type) {
    case SET_ADMIN:
        return isAdmin;
    default:
        return state;
    }
};

export default combineReducers({
    alerts,
    currentTab,
    isAdmin,
});
