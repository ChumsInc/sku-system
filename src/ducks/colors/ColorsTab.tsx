/**
 * Created by steve on 3/21/2017.
 */

import React from 'react';
import ColorsFilter from "./ColorsFilter";
import ColorsList from "./ColorsList";
import ColorEditor from "./ColorEditor";

const ColorsTab: React.FC = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-6">
                    <ColorsFilter/>
                    <ColorsList/>
                </div>
                <div className="col-4">
                    <ColorEditor />
                </div>
                <div className="col-2">
                    <h3>Where Used</h3>
                    (reserved space for where-used list)
                </div>
            </div>
        </div>
    )
}
export default ColorsTab
