/**
 * Created by steve on 3/21/2017.
 */

import React from 'react';
import ColorsFilter from "./ColorsFilter";
import ColorsList from "./ColorsList";

const ColorsTab: React.FC = () => {

    return (
        <div className="container">
            <div className="row g-3">
                <div className="col-8">
                    <ColorsFilter/>
                    <ColorsList/>
                </div>
                <div className="col-4">
                    Color Editor
                </div>
            </div>
        </div>
    )
}
export default ColorsTab
