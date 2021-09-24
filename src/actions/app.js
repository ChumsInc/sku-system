import {DISMISS_ALERT, FETCH_SETTINGS, RECEIVE_COLORS, SET_ADMIN, SET_ALERT, SET_TAB} from "../constants";
import {fetchGET} from "../chums-components/fetch";

export const setAlert = ({
                             type = 'warning',
                             title = 'Oops!',
                             message = 'There was an error'}) => ({type: SET_ALERT, alert: {type, title, message}});

export const dismissAlert = (id) => ({type: DISMISS_ALERT, id});


export const setTab = (tab) => ({type: SET_TAB, tab});

export const loadPermissions = () => (dispatch, getState) => {
    fetchGET('/node-dev/user/validate/role/inventory_admin')
        .then(res => {
            dispatch({type: SET_ADMIN, isAdmin: res.success === true});
        })
        .catch(err => {
            dispatch(setAlert({message: 'Unable to load user permissions'}));
        });
};

export const fetchSettings = (company) => (dispatch, getState) => {
    if (!company) {
        const state = getState();
        company = state.app.company || DEFAULTS.company;
    }
    dispatch({type: FETCH_SETTINGS});
    const url = '/node-dev/production/pm/settings/:company'
        .replace(':company', encodeURIComponent(company));
    fetchGET(url)
        .then(res => {
            const {
                categories = [],
                colors = [],
                lines = [],
                mixes = [],
                skuList = [],
                subCategories = []
            } = res;
            dispatch({type: RECEIVE_SETTINGS, categories, colors, lines, mixes, skuList, subCategories});
        })
        .catch(err => {
            dispatch(setAlert({message: err.message || 'Unable to fetch settings'}));
        })
};
