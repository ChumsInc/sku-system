import {CurrentValueState} from "../redux-utils";
import {QueryStatus} from "@reduxjs/toolkit/query";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import {fetchVersion} from "../../api/version";
import {RootState} from "../../app/configureStore";

export interface VersionState extends CurrentValueState<string> {
}

const initialVersionState: VersionState = {
    value: '',
    loading: QueryStatus.uninitialized,
    saving: QueryStatus.uninitialized,
}

export const selectCurrentVersion = (state: RootState) => state.version.value;
export const selectVersionLoading = (state: RootState) => state.version.loading === QueryStatus.pending;

export const loadVersion = createAsyncThunk<string>(
    'version/load',
    async () => {
        return await fetchVersion();
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectVersionLoading(state);
        }
    }
);

const versionReducer = createReducer(initialVersionState, (builder) => {
    builder
        .addCase(loadVersion.pending, (state) => {
            state.loading = QueryStatus.pending;
        })
        .addCase(loadVersion.fulfilled, (state, action) => {
            state.value = action.payload;
            state.loading = QueryStatus.fulfilled;
        })
        .addCase(loadVersion.rejected, (state) => {
            state.loading = QueryStatus.rejected;
        })
});

export default versionReducer;
