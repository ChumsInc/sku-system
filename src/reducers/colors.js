import {combineReducers} from 'redux';
import {
    FETCH_COLORS,
    FETCH_COLORS_FAILURE,
    RECEIVE_COLOR,
    RECEIVE_COLORS,
    SELECT_COLOR,
    UPDATE_COLOR
} from "../constants";

const list = (state = [], action) => {
    const {type, colors, color} = action;
    switch (type) {
    case RECEIVE_COLORS:
        return [...colors];
    case RECEIVE_COLOR:
        return [...state.filter(c => c.id !== color.id), {...color}];
    default:
        return state;
    }
};

const selected = (state = {}, action) => {
    const {type, color, field, value} = action;
    switch (type) {
    case SELECT_COLOR:
    case RECEIVE_COLOR:
        return {...color};
    case UPDATE_COLOR:
        return {...state, [field]: value, changed: true};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_COLORS:
        return true;
    case FETCH_COLORS_FAILURE:
    case RECEIVE_COLORS:
        return false;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    selected,
    loading,
});
