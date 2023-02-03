// @ts-ignore
import {ActionInterface, ActionPayload, fetchJSON} from "chums-ducks";
import {CurrentValueState, initialCurrentValueState} from "../redux-utils";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchIsAdmin} from "../../api/user";
import {RootState} from "../../app/configureStore";

export interface UserState extends CurrentValueState<boolean> {
    loaded: boolean;
}

const initialUserState: UserState = {
    ...initialCurrentValueState,
    loaded: false,
}

export const loadUser = createAsyncThunk<boolean>(
    'user/load',
    async () => {
        return await fetchIsAdmin();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectUserLoading(state);
        }
    }
)

const userReducer = createReducer(initialUserState, (builder) => {
    builder
        .addCase(loadUser.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.value = action.payload;
            state.loading = QueryStatus.fulfilled;
            state.loaded = true;
        })
        .addCase(loadUser.rejected, (state, action) => {
            state.value = false;
            state.loading = QueryStatus.rejected;
        })
});

export default userReducer;


export const selectIsAdmin = (state: RootState) => state.user.value ?? false;
export const selectUserLoading = (state: RootState) => state.user.loading === QueryStatus.pending;
export const selectUserLoaded = (state: RootState) => state.user.loaded;

