/**
 * Created by steve on 3/29/2017.
 */

import React, {Component} from 'react';
import UPCByColorEditor from './UPCByColorEditor';
import UPCByColorList from "./UPCByColorList";

export default class UPCByColorTab extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-8">
                    <UPCByColorList />
                </div>
                <div className="col-sm-4">
                    <UPCByColorEditor/>
                </div>
            </div>
        )
    }
}
