import React, {useEffect} from 'react';
import {useAppDispatch} from "../../app/configureStore";
import {useSelector} from "react-redux";
import {loadVersion, selectCurrentVersion} from "./index";
import {Alert} from "chums-components";

export default function Version() {
    const dispatch = useAppDispatch();
    const version = useSelector(selectCurrentVersion);
    useEffect(() => {
        dispatch(loadVersion());
    }, [])

    return (
        <div onClick={() => dispatch(loadVersion())}>
            <Alert color="light" title="Version">
                {version}
                <a href="https://github.com/UtahGooner/sku-system/blob/master/CHANGELOG.md" className="ms-3" target="_blank">
                    Change log
                </a>
            </Alert>
        </div>

    )
};
