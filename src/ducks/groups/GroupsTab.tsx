/**
 * Created by steve on 3/21/2017.
 */

import React from 'react';
import GroupsFilter from "./GroupsFilter";
import GroupsList from "./GroupsList";
import GroupEditor from "./GroupEditor";

const GroupsTab: React.FC = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-8">
                    <GroupsFilter/>
                    <GroupsList/>
                </div>
                <div className="col-4">
                    <GroupEditor />
                </div>
            </div>
        </div>
    )
}
export default GroupsTab
