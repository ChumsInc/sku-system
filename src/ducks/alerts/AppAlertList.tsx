import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {AlertList, dismissAlert, type ErrorAlert, selectAllAlerts} from "@chumsinc/alert-list";

const AppAlertList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectAllAlerts);

    const dismissHandler = (alert: ErrorAlert) => {
        dispatch(dismissAlert(alert));
    }

    return (
        <AlertList list={list} onDismiss={dismissHandler}/>
    )
}
export default AppAlertList;
