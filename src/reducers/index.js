import {combineReducers} from 'redux';
import app from './app';
import colors from './colors';
import mixes from './mixes';
import sku from './sku';
import colorUPC from './colorUPC';
import groups from './groups';
import categories from './categories';
import settings from './settings';

export default combineReducers({
    app,
    colors,
    mixes,
    sku,
    colorUPC,
    groups,
    categories,
    settings,
})
