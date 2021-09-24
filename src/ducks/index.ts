import {combineReducers} from 'redux';
import app from '../reducers/app';
import colors from './colors';
import mixes from './mixes';
import {default as itemsReducer} from './items';
import {default as skuReducer} from './sku';
import colorUPC from './colorUPC';
import {default as groupsReducer} from './groups';
import categories from '../reducers/categories';
import settings from './settings';
import {default as usersReducer} from './users';
import {tabsReducer, sortableTablesReducer, alertsReducer, pagesReducer} from 'chums-ducks';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    app,
    colors,
    mixes,
    sku: skuReducer,
    items: itemsReducer,
    colorUPC,
    groups: groupsReducer,
    categories,
    pages: pagesReducer,
    settings,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
    users: usersReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
