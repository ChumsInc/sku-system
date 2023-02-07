import {Tab, TabList} from "chums-components";
import React from "react";
import {NavLink} from "react-router-dom";


export interface RoutedTab extends Tab {
    to: string;
}

export const tabPaths = {
    sku: '/sku',
    byColor: '/by-color',
    colors: '/colors',
    mixes: '/mixes',
    groups: '/groups',
    categories: '/categories',
}
export const TAB_SKU_LIST: RoutedTab = {id: 'TAB_SKU_LIST', to: tabPaths.sku, title: 'Base SKU'};
export const TAB_UPC_BY_COLOR: RoutedTab = {id: 'TAB_UPC_BY_COLOR', to: tabPaths.byColor, title: 'By Color UPC'};
export const TAB_COLORS: RoutedTab = {id: 'TAB_COLORS', to: tabPaths.colors, title: 'Colors'};
export const TAB_MIXES: RoutedTab = {id: 'TAB_MIXES', to: tabPaths.mixes, title: 'Mixes'};
export const TAB_GROUPS: RoutedTab = {id: 'TAB_GROUPS', to: tabPaths.groups, title: 'SKU Groups'};
export const TAB_CATEGORIES: RoutedTab = {id: 'TAB_CATEGORIES', to: tabPaths.categories, title: 'Product Categories'};

export const tabSetID = 'root-tabs';
export const appTabs: RoutedTab[] = [
    TAB_SKU_LIST,
    TAB_UPC_BY_COLOR,
    TAB_COLORS,
    TAB_MIXES,
    TAB_GROUPS,
    TAB_CATEGORIES
];

const AppTabs: React.FC = () => {

    return (
        <TabList className="mb-1">
            {appTabs.map(tab => (
                <li className="nav-item" key={tab.id}>
                    <NavLink to={tab.to} className="nav-link">
                        {tab.title}
                    </NavLink>
                </li>
            ))}
        </TabList>
    )
}

export default AppTabs;
