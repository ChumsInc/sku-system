import React from 'react';
import {useSelector} from "react-redux";
import SKUSystemList from "./SKUSystemList";
import SKUFilter from "./SKUFilter";
import {selectSelectedGroup} from "./selectors";
import SKUEditor from "./SKUEditor";
import SKUItemList from "../items/SKUItemList";

const SKUSystemTab: React.FC = () => {
    const selectedGroup = useSelector(selectSelectedGroup);
    return (
        <div>
            <SKUFilter/>
            {!!selectedGroup?.notes && (<div className="alert alert-info">{selectedGroup.notes}</div>)}
            <div className="row">
                <div className="col-sm-4">
                    <SKUSystemList/>
                </div>
                <div className="col-sm-3">
                    <SKUEditor />
                </div>
                <div className="col-sm-5">
                    <SKUItemList/>
                </div>
            </div>
        </div>
    )
}


export default SKUSystemTab;


/*
@TODO - Link 98 & 99 Series SKUs, so they use the same final three digits.
 */
