import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import SKUSystemTab from '../ducks/sku/SKUSystemTab';
import {loadUser} from "../ducks/users";
import {loadSettings} from "../ducks/settings";
import ColorsTab from "../ducks/colors/ColorsTab";
import MixesTab from "../ducks/mixes/MixesTab";
import GroupsTab from "../ducks/groups/GroupsTab";
import CategoriesTab from "../ducks/categories/CategoriesTab";
import ColorUPCTab from "../ducks/colorUPC/ColorUPCTab";
import {useAppDispatch} from "./configureStore";
import {ErrorBoundary} from "chums-components";
import AlertList from "../ducks/alerts/AlertList";
import AppContent from "./AppContent";
import IndexRedirect from "./IndexRedirect";


const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadUser());
        dispatch(loadSettings());
    }, []);


    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<AppContent/>}>
                    <Route index element={<IndexRedirect />} />
                    <Route path="/sku" element={<SKUSystemTab/>}/>
                    <Route path="/by-color" element={<ColorUPCTab/>}/>
                    <Route path="/colors" element={<ColorsTab/>}/>
                    <Route path="/mixes" element={<MixesTab/>}/>
                    <Route path="/groups" element={<GroupsTab/>}/>
                    <Route path="/categories" element={<CategoriesTab/>}/>
                </Route>
            </Routes>
        </ErrorBoundary>
    );
};
export default App;
