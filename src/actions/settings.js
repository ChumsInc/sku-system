import {fetchGET, fetchPOST} from '../chums-components/fetch';
import {
    COMPANIES, DEFAULTS,
    FETCH_SETTINGS,
    RECEIVE_SETTINGS,
} from "../constants";
import {setAlert} from "./app";

export const fetchSettings = (company) => (dispatch, getState) => {
    if (!company) {
        const state = getState();
        company = state.app.company || DEFAULTS.company;
    }
    dispatch({type: FETCH_SETTINGS});
    const url = '/api/operations/production/pm/settings/:company'
        .replace(':company', encodeURIComponent(company));
    fetchGET(url)
        .then(res => {
            const {
                colors = [],
                lines = [],
                mixes = [],
                skuList = [],
                subCategories = []
            } = res;
            dispatch({type: RECEIVE_SETTINGS, colors, lines, mixes, skuList, subCategories});
        })
        .catch(err => {
            dispatch(setAlert({message: err.message || 'Unable to fetch settings'}));
        })
};

