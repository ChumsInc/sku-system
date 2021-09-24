import {RECEIVE_COLOR, RECEIVE_COLORS, SELECT_COLOR, UPDATE_COLOR} from "../constants";
import {fetchGET, fetchPOST} from "../chums-components/fetch";
import {setAlert} from "./app";

export const selectColor = (color) => ({type: SELECT_COLOR, color});

export const fetchColors = () => (dispatch, getState) => {
    fetchGET('/node-dev/sku/colors')
        .then(res => {
            const colors = res.result
                .map(c => ({...c, notes: c.notes || '', key: c.id}));
            dispatch({type: RECEIVE_COLORS, colors});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error loading colors: ${err.message}`}))
        });
};

export const updateColor = (field, value) => ({type: UPDATE_COLOR, field, value});

export const saveColor = (color) => (dispatch, getState) => {
    const {app} = getState();
    if (!app.isAdmin) {
        return;
    }
    const url = '/node-dev/sku/colors';
    fetchPOST(url, color)
        .then(res => {
            dispatch({type: RECEIVE_COLOR, color: res.result[0]});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error saving color: ${err.message}`}))
        });

};
