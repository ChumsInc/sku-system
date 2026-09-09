import {Outlet} from 'react-router';
import AppTabs from "../components/AppTabs";
import AppAlertList from "@/ducks/alerts/AppAlertList.tsx";

export default function AppContent() {

    return (
        <div className="sku-system-container">
            <AppAlertList/>
            <AppTabs />
            <Outlet />
        </div>
    )
}
