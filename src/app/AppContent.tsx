import React from 'react';
import {Outlet} from 'react-router-dom';
import AppTabs from "../components/AppTabs";
import AlertList from "../ducks/alerts/AlertList";

export default function AppContent() {

    return (
        <div className="sku-system-container">
            <AlertList/>
            <AppTabs />
            <Outlet />
        </div>
    )
}
