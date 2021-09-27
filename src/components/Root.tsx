import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {HashRouter as Router, Redirect, Route} from 'react-router-dom';
import SKUSystemTab from '../ducks/sku/SKUSystemTab';
import {loadPermissionsAction} from "../ducks/users";
import AppTabs, {tabPaths} from "./AppTabs";
import {AlertList} from "chums-ducks";
import {fetchSettingsAction} from "../ducks/settings";
import ColorsTab from "../ducks/colors/ColorsTab";
import MixesTab from "../ducks/mixes/MixesTab";
import GroupsTab from "../ducks/groups/GroupsTab";
import CategoriesTab from "../ducks/categories/CategoriesTab";
import ColorUPCTab from "../ducks/colorUPC/ColorUPCTab";


const Root:React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Root::useEffect()')
        dispatch(loadPermissionsAction());
        dispatch(fetchSettingsAction());
    }, []);


    return (
        <Router>
            <div className="sku-system-container">
                <AlertList />
                <Route exact path="/" render={() => (
                    <Redirect to={tabPaths.sku} />
                )} />
                <Route path="/" component={AppTabs} />
                <Route path={tabPaths.sku} component={SKUSystemTab} />
                <Route path={tabPaths.byColor} component={ColorUPCTab} />
                <Route path={tabPaths.colors} component={ColorsTab} />
                <Route path={tabPaths.mixes} component={MixesTab} />
                <Route path={tabPaths.groups} component={GroupsTab} />
                <Route path={tabPaths.categories} component={CategoriesTab} />
            </div>
        </Router>
    );
};
export default Root;
