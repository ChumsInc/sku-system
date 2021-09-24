import {combineReducers} from "redux";
import {ActionInterface, ActionPayload, fetchJSON} from "chums-ducks";
import {RootState} from '../index';
import {ThunkAction} from "redux-thunk";


export interface UserPayload extends ActionPayload {
    isAdmin?: boolean,
}

export interface UserAction extends ActionInterface {
    payload?: UserPayload,
}

export interface UserThunkAction extends ThunkAction<any, RootState, unknown, UserAction> {}


export const fetchPermissionsRequested = 'user/fetchPermissionsRequested';
export const fetchPermissionsSucceeded = 'user/fetchPermissionsSucceeded';
export const fetchPermissionsFailed = 'user/fetchPermissionsFailed';

export const selectIsAdmin = (state: RootState) => state.users.isAdmin;
export const selectPermissionsLoading = (state: RootState) => state.users.loading;
export const selectPermissionsLoaded = (state: RootState) => state.users.loaded;

export const loadPermissionsAction = (): UserThunkAction =>
    async (dispatch, getState) => {
        try {
            const state = getState();
            console.log(state);
            // if (selectPermissionsLoading(state)) {
            //     return;
            // }
            dispatch({type: fetchPermissionsRequested});
            const {success} = await fetchJSON('/api/user/validate/role/inventory_admin');
            dispatch({type: fetchPermissionsSucceeded, payload: {isAdmin: success || false}});
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("loadPermissionsAction()", error.message);
                return dispatch({type: fetchPermissionsFailed, payload: {error, context: fetchPermissionsRequested}})
            }
            console.error("loadPermissionsAction()", error);
        }
    };


const isAdminReducer = (state: boolean = false, action: UserAction): boolean => {
    switch (action.type) {
    case fetchPermissionsSucceeded:
        return action?.payload?.isAdmin || false;
    default:
        return state;
    }
}

const loadingReducer = (state: boolean = false, action: UserAction): boolean => {
    switch (action.type) {
    case fetchPermissionsRequested:
        return true;
    case fetchPermissionsSucceeded:
    case fetchPermissionsFailed:
        return false;
    default:
        return state;
    }
}

const loadedReducer = (state: boolean = false, action: UserAction): boolean => {
    switch (action.type) {
    case fetchPermissionsSucceeded:
        return true;
    case fetchPermissionsRequested:
    case fetchPermissionsFailed:
        return false;
    default:
        return state;
    }
}

export default combineReducers({
    isAdmin: isAdminReducer,
    loading: loadingReducer,
    loaded: loadedReducer,
})
