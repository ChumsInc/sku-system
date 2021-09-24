/**
 * Created by steve on 3/21/2017.
 */

import React, {Component} from 'react';
import MixEditor from './MixEditor';
import DataTableFilter from '../chums-components/DataTableFilter';
import PropTypes from "prop-types";
import {fetchMixes, saveMix, selectMix, updateMix} from "../actions/mixes";
import {connect} from "react-redux";
import TrimmedText from "./TrimmedText";
import SortableTable from "../chums-components/SortableTable";

const tableFields = [
    {field: 'code', title: 'Code'},
    {field: 'description', title: 'Description'},
    {field: 'notes', title: 'Notes', render: ({notes}) => (<TrimmedText text={notes} length={65}/>)}
];

class MixesTab extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        selected: PropTypes.object,
        loading: PropTypes.bool,
        isAdmin: PropTypes.bool,
    };

    state = {
        filter: '',
        showInactive: false,
        rowsPerPage: 10,
        page: 1,
    };

    constructor(props) {
        super(props);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onClickNew = this.onClickNew.bind(this);
        this.onChangeRows = this.onChangeRows.bind(this);
        this.onReload = this.onReload.bind(this);
        this.onToggleInactive = this.onToggleInactive.bind(this);
        this.onSaveMix = this.onSaveMix.bind(this);
        this.onChangeMix = this.onChangeMix.bind(this);
    }

    componentDidMount() {
        this.onReload();
    }

    onReload() {
        this.props.dispatch(fetchMixes())
    }


    onChangeRows(ev) {
        this.setState({
            rowsPerPage: Number(ev.target.value) || 10
        })
    }

    onChangeFilter(val) {
        this.setState({
            filter: val,
        });
    }

    onToggleInactive() {
        this.setState({
            showInactive: !this.state.showInactive
        });
    }


    onSelect(mix) {
        this.props.dispatch(selectMix(mix));
    }

    onClickNew() {
        this.onSelect({})
    }

    onChangeMix(field, value) {
        this.props.dispatch(updateMix(field, value));
    }

    onSaveMix() {
        this.props.dispatch(saveMix(this.props.selected));
    }


    render() {
        let reFilter;
        const {list, isAdmin, loading, selected} = this.props;
        const {filter, showInactive, rowsPerPage, page} = this.state;
        try {
            reFilter = new RegExp('\\b' + filter, 'i');
        } catch (err) {
            reFilter = /./i;
        }
        const mixes = list
            .filter(mix => showInactive || mix.active)
            .filter(mix => filter.trim() === '' || reFilter.test(mix.code) || reFilter.test(mix.description) || reFilter.test(mix.notes || ''));

        return (
            <div className="row">
                <div className="col-sm-8">
                    <DataTableFilter filter={filter}
                                     showInactive={showInactive}
                                     onReload={this.onReload}
                                     onChangeFilter={this.onChangeFilter}
                                     onToggleInactive={this.onToggleInactive}>
                        <button type="btn" className="btn btn-sm btn-outline-secondary" onClick={this.onClickNew}>
                            New Mix
                        </button>
                    </DataTableFilter>
                    <SortableTable fields={tableFields} data={mixes} defaultSort="code" onSelect={this.onSelect}
                                   page={page} onChangePage={(page) => this.setState({page})}
                                   rowsPerPage={rowsPerPage}
                                   onChangeRowsPerPage={(rowsPerPage) => this.setState({rowsPerPage, page: 1})}

                    />
                </div>
                <div className="col-sm-4">
                    <MixEditor mix={selected} onSave={this.onSaveMix} onChange={this.onChangeMix} isAdmin={isAdmin}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {list, selected, loading} = state.mixes;
    const {isAdmin} = state.app;
    return {list, selected, loading, isAdmin};
};

export default connect(mapStateToProps)(MixesTab);
