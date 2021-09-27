import {combineReducers} from 'redux';
import {default as colorsReducer} from './colors';
import {default as mixesReducer} from './mixes';
import {default as itemsReducer} from './items';
import {default as skuReducer} from './sku';
import {default as colorUPCReducer} from './colorUPC';
import {default as groupsReducer} from './groups';
import {default as categoriesReducer} from './categories';
import {default as settingsReducer} from './settings';
import {default as usersReducer} from './users';
import {tabsReducer, sortableTablesReducer, alertsReducer, pagesReducer} from 'chums-ducks';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    categories: categoriesReducer,
    colors: colorsReducer,
    mixes: mixesReducer,
    sku: skuReducer,
    items: itemsReducer,
    colorUPC: colorUPCReducer,
    groups: groupsReducer,
    pages: pagesReducer,
    settings: settingsReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
