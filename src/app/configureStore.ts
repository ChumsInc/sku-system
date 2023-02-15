import {configureStore} from '@reduxjs/toolkit'
import {combineReducers} from "redux";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import alertsReducer from "../ducks/alerts";
import categoriesReducer from "../ducks/categories";
import colorUPCReducer from "../ducks/colorUPC";
import colorsReducer from "../ducks/colors";
import skuGroupsReducer from "../ducks/groups";
import userReducer from "../ducks/users";
import skuReducer from "../ducks/sku";
import itemsReducer from "../ducks/items";
import settingsReducer from "../ducks/settings";
import mixesReducer from "../ducks/mixes";
import versionReducer from "../ducks/version";


const rootReducer = combineReducers({
    alerts: alertsReducer,
    categories: categoriesReducer,
    colors: colorsReducer,
    mixes: mixesReducer,
    sku: skuReducer,
    items: itemsReducer,
    colorUPC: colorUPCReducer,
    skuGroups: skuGroupsReducer,
    // pages: pagesReducer,
    settings: settingsReducer,
    // sortableTables: sortableTablesReducer,
    // tabs: tabsReducer,
    user: userReducer,
    version: versionReducer,
})

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
