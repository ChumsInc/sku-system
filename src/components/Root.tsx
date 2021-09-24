import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {HashRouter as Router, Redirect, Route} from 'react-router-dom';
import SKUSystemTab from '../ducks/sku/SKUSystemTab';
import {loadPermissionsAction} from "../ducks/users";
import AppTabs, {tabPaths} from "./AppTabs";
import {AlertList} from "chums-ducks";
import {fetchSettingsAction} from "../ducks/settings";
import ColorsTab from "../ducks/colors/ColorsTab";


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
                <div className="container-fluid">
                    <Route path={tabPaths.sku} component={SKUSystemTab} />
                    {/*<Route path={tabPaths.byColor} component={UPCByColorTab} />*/}
                    <Route path={tabPaths.colors} component={ColorsTab} />
                    {/*<Route path={tabPaths.mixes} component={MixesTab} />*/}
                    {/*<Route path={tabPaths.groups} component={GroupsTab} />*/}
                    {/*<Route path={tabPaths.categories} component={CategoriesTab} />*/}
                </div>
                <div style={{position: 'fixed', bottom: '0', right: '0', left: '0'}}>
                    {/*Version: {version}*/}
                </div>
            </div>
        </Router>
    );
};
export default Root;
