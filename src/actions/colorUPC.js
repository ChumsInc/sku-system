import {
    FETCH_COLOR_UPC_LIST,
    RECEIVE_COLOR_UPC,
    RECEIVE_COLOR_UPC_LIST,
    SELECT_COLOR_UPC,
    UPDATE_COLOR_UPC
} from "../constants";
import {fetchGET, fetchPOST} from "../chums-components/fetch";
import {setAlert} from "./app";

export const selectColorUPC = (upc = {id: 0}) => ({type: SELECT_COLOR_UPC, upc});

export const fetchColorUPCList = () => (dispatch, getState) => {
    dispatch({type: FETCH_COLOR_UPC_LIST});
    fetchGET('/node-dev/sku/by-color/')
        .then(res => {
            const list = res.result
                .map(item => ({
                    ...item,
                    notes: item.notes || '',
                    active: !(item.InactiveItem === 'Y' || item.ProductType === 'D'),
                    UDF_UPC_BY_COLOR: item.UDF_UPC_BY_COLOR || '',
                    UDF_UPC: item.UDF_UPC || ''
                }));
            dispatch({type: RECEIVE_COLOR_UPC_LIST, list});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error loading by-color UPC list: ${err.message}`}))
        });
};

export const updateColorUPC = (field, value) => ({type: UPDATE_COLOR_UPC, field, value});

export const saveColorUPC = () => (dispatch, getState) => {
    const state = getState();
    const upc = state.colorUPC.selected;
    if (!state.app.isAdmin) {
        return;
    }
    const url = '/node-dev/sku/by-color';
    fetchPOST(url, upc)
        .then(res => {
            const item = res.result[0];
            const upc = {
                ...item,
                notes: item.notes || '',
                active: !(item.InactiveItem === 'Y' || item.ProductType === 'D'),
                UDF_UPC_BY_COLOR: item.UDF_UPC_BY_COLOR || '',
                UDF_UPC: item.UDF_UPC || ''
            };
            dispatch({type: RECEIVE_COLOR_UPC, upc});
        })
        .catch(err => {
            dispatch(setAlert({message: `Error saving by-color UPC: ${err.message}`}))
        });

};

export const getNextByColorUPC = () => (dispatch, getState) => {
    const state = getState();
    if (!state.app.isAdmin) {
        return;
    }
    const url = '/node-dev/sku/by-color/next';
    fetchGET(url)
        .then(res => {
            dispatch(selectColorUPC({id: 0, company: 'chums', upc: res.result}))
        })
        .catch(err => {
            console.log('getNextUPC()', err.message);
            dispatch(setAlert({message: `Error fetching new by-color UPC: ${err.message}`}))
        });
};

export const updateSageByColorUPC = () => (dispatch, getState) => {
    const {app} = getState();
    if (!app.isAdmin) {
        return;
    }
};
