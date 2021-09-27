/**
 * Created by steve on 3/21/2017.
 */

import React from 'react';
import MixesFilter from "./MixesFilter";
import MixesList from "./MixesList";
import MixEditor from "./MixEditor";

const MixesTab: React.FC = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-4">
                    <MixesFilter/>
                    <MixesList/>
                </div>
                <div className="col-4">
                    <MixEditor />
                </div>
                <div className="col-4">
                    (reserved space for where-used list)
                </div>
            </div>
        </div>
    )
}
export default MixesTab
