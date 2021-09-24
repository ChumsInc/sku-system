import {combineReducers} from 'redux';
import {
    FETCH_GROUPS,
    FETCH_GROUPS_FAILURE,
    RECEIVE_GROUP,
    RECEIVE_GROUPS,
    SELECT_GROUP,
    UPDATE_GROUP
} from "../constants";

const list = (state = [], action) => {
    const {type, groups, group} = action;
    switch (type) {
    case RECEIVE_GROUPS:
        return [...groups];
    case RECEIVE_GROUP:
        return [...state.filter(g => g.id !== group.id), {...group}];
    default:
        return state;
    }
};

const selected = (state = {}, action) => {
    const {type, group, field, value} = action;
    switch (type) {
    case SELECT_GROUP:
    case RECEIVE_GROUP:
        return {...group};
    case UPDATE_GROUP:
        return {...state, [field]: value, changed: true};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type} = action;
    switch (type) {
    case FETCH_GROUPS:
        return true;
    case FETCH_GROUPS_FAILURE:
    case RECEIVE_GROUPS:
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
