import {combineReducers} from 'redux';
import {
    FETCH_MIXES, FETCH_MIXES_FAILURE,
    RECEIVE_MIX, RECEIVE_MIXES,
    SELECT_MIX,
    UPDATE_MIX
} from "../constants";

const list = (state = [], action) => {
    const {type, mixes, mix} = action;
    switch (type) {
    case RECEIVE_MIXES:
        return [...mixes];
    case RECEIVE_MIX:
        return [...state.filter(m => m.id !== mix.id), {...mix}];
    default:
        return state;
    }
};

const selected = (state = {}, action) => {
    const {type, mix, field, value} = action;
    switch (type) {
    case SELECT_MIX:
    case RECEIVE_MIX:
        return {...mix};
    case UPDATE_MIX:
        return {...state, [field]: value, changed: true};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_MIXES:
        return true;
    case FETCH_MIXES_FAILURE:
    case RECEIVE_MIXES:
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
