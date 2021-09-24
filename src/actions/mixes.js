import {RECEIVE_MIX, RECEIVE_MIXES, SELECT_MIX, UPDATE_MIX} from "../constants";
import {fetchGET, fetchPOST} from "../chums-components/fetch";
import {setAlert} from "./app";

export const selectMix = (mix) => ({type: SELECT_MIX, mix});

export const fetchMixes = () => (dispatch, getState) => {
    fetchGET('/node-dev/sku/mixes')
        .then(res => {
            const mixes = res.result
                .map(m => ({...m, key: m.id, notes: m.notes || ''}));
            dispatch({type: RECEIVE_MIXES, mixes});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error loading mixes: ${err.message}`}))
        });
};

export const updateMix = (field, value) => ({type: UPDATE_MIX, field, value});

export const saveMix = (mix) => (dispatch, getState) => {
    const state = getState();
    if (!state.app.isAdmin) {
        return;
    }
    const url = '/node-dev/sku/mixes';
    fetchPOST(url, mix)
        .then(res => {
            dispatch({type: RECEIVE_MIX, mix: res.result[0]});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error saving mix: ${err.message}`}))
        });

};
