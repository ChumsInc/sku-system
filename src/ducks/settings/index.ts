
import {QueryStatus} from "@reduxjs/toolkit/query";
import type {ProductLine} from "chums-types";
import {createAsyncThunk, createReducer} from "@reduxjs/toolkit";
import type {SettingsResponse} from "../../types";
import {fetchSettings} from "../../api/settings";
import {loadSKUList} from "../sku/actions";
import {loadCategoryList} from "../categories";
import {loadColorsList} from "../colors";
import {loadColorUPCList} from "../colorUPC";
import {loadSKUGroupList} from "../groups";
import type {RootState} from "../../app/configureStore";
import {loadMixes} from "../mixes";

export interface SettingsState {
    loading: QueryStatus;
    productLines: ProductLine[];
}

const initialSettingsState:SettingsState = {
    loading: QueryStatus.uninitialized,
    productLines: [],
}

export const loadSettings = createAsyncThunk<SettingsResponse|null>('' +
    'settings/load',
    async (_, {dispatch}) => {
        dispatch(loadSKUList());
        dispatch(loadCategoryList());
        dispatch(loadColorsList());
        dispatch(loadColorUPCList());
        dispatch(loadSKUGroupList());
        dispatch(loadMixes())
        return await fetchSettings();
    },
    {
        condition: (_, {getState}) => {
            const state = getState() as RootState;
            return !selectLoading(state);
        }
    })

const settingsReducer = createReducer(initialSettingsState, (builder) => {
    builder
        .addCase(loadSettings.pending, (state, ) => {
        state.loading = QueryStatus.pending;
    })
        .addCase(loadSettings.fulfilled, (state, action) => {
            state.productLines = action.payload?.lines ?? [];
            state.loading = QueryStatus.fulfilled;
        })
        .addCase(loadSettings.rejected, (state, ) => {
            state.loading = QueryStatus.rejected;
        })
});

export default settingsReducer;


export const selectLoading = (state: RootState) => state.settings.loading === QueryStatus.pending;
export const selectProductLineList = (state: RootState) => state.settings.productLines;
// export const selectSKUList = (state: RootState) => state.settings.skuList;
// export const selectSubCategoryList = (state: RootState) => state.settings.subCategories;


