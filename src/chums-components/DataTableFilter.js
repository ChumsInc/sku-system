/**
 * Created by steve on 3/22/2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class DataTableFilter extends Component {
    static propTypes = {
        filter: PropTypes.string.isRequired,
        onChangeFilter: PropTypes.func.isRequired,
        onReload: PropTypes.func,
        showInactive: PropTypes.bool,
        onToggleInactive: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.onToggleInactive = this.onToggleInactive.bind(this);
        this.onClickReload = this.onClickReload.bind(this);
        this.onChangeFilter = this.onChangeFilter.bind(this);
    }


    onChangeFilter(ev) {
        this.props.onChangeFilter(ev.target.value);
    }

    onClickReload() {
        this.props.onReload();
    }

    onToggleInactive(ev) {
        this.props.onToggleInactive();
    }

    renderInactive() {
        if (this.props.onToggleInactive !== undefined) {
            return (
                <div className="form-group order-1">
                    <div className="custom-control custom-switch custom-control-inline">
                        <input type="checkbox" className="custom-control-input"
                               checked={this.props.showInactive} onChange={this.onToggleInactive}/>
                        <label className="custom-control-label" onClick={this.onToggleInactive}>
                            Show Inactive
                        </label>
                    </div>
                </div>
            )
        }
        return null;
    }

    renderReload() {
        if (this.props.onReload !== undefined) {
            return (
                <div className="form-group order-1">
                    <button type="btn" className="btn btn-sm btn-primary" onClick={this.onClickReload}>Reload</button>
                </div>
            )
        }
        return null;
    }

    render() {
        return (
            <div className="form-inline data-table-filter">
                <div className="form-group order-1">
                    <label>Filter</label>
                    <input type="text" className="form-control form-control-sm" value={this.props.filter}
                           placeholder="Filter this list"
                           onChange={this.onChangeFilter}/>
                </div>
                {this.renderInactive()}
                {this.props.children || []}
                {this.renderReload()}
            </div>
        )
    }
}
