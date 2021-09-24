import {Tab, tabListCreatedAction, TabRouterList} from "chums-ducks";
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";

export const tabPaths = {
    sku: '/sku',
    byColor: '/by-color',
    colors: '/colors',
    mixes: '/mixes',
    groups: '/groups',
    categories: '/categories',
}
export const TAB_SKU_LIST:Tab = {id: 'TAB_SKU_LIST', to: tabPaths.sku, title: 'SKU List'};
export const TAB_UPC_BY_COLOR:Tab = {id: 'TAB_UPC_BY_COLOR', to: tabPaths.byColor, title: 'By Color UPC'};
export const TAB_COLORS:Tab = {id: 'TAB_COLORS', to: tabPaths.colors, title: 'Colors'};
export const TAB_MIXES:Tab = {id: 'TAB_MIXES', to: tabPaths.mixes, title: 'Mixes'};
export const TAB_GROUPS:Tab = {id: 'TAB_GROUPS', to: tabPaths.groups, title: 'SKU Groups'};
export const TAB_CATEGORIES:Tab = {id: 'TAB_CATEGORIES', to: tabPaths.categories, title: 'Product Categories'};

export const tabSetID = 'root-tabs';
export const appTabs:Tab[] = [
    TAB_SKU_LIST,
    TAB_UPC_BY_COLOR,
    TAB_COLORS,
    TAB_MIXES,
    TAB_GROUPS,
    TAB_CATEGORIES
];

const AppTabs:React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(tabListCreatedAction(appTabs, tabSetID));
    }, []);

    return (<TabRouterList tabKey={tabSetID} className="mb-1" />)
}

export default AppTabs;
