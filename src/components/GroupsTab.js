/**
 * Created by steve on 3/21/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import GroupEditor from './GroupEditor';
import DataTableFilter from '../chums-components/DataTableFilter';
import {connect} from "react-redux";
import {fetchGroupsAction, saveGroupAction, selectSelectedSKUGroup, groupChangedAction} from "../ducks/groups";
import ProductLineText from "./ProductLineText";
import TrimmedText from "./TrimmedText";
import SortableTable from "../chums-components/SortableTable";
import ProgressBar from "../chums-components/ProgressBar";

const tableFields = [
    {field: 'code', title: 'SKU Group'},
    {field: 'description', title: 'Description'},
    {
        field: 'productLine',
        title: 'Product Line',
        render: (row) => <ProductLineText productLineCode={row.productLine}/>
    },
    {field: 'notes', title: 'Notes', render: (row) => <TrimmedText text={row.notes} length={65}/>},
];

class GroupsTab extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        selected: PropTypes.object,
        loading: PropTypes.bool,
        isAdmin: PropTypes.bool,
        productLines: PropTypes.array,
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
        this.onClickSelected = this.onClickSelected.bind(this);
        this.onClickNew = this.onClickNew.bind(this);
        this.onChangeGroup = this.onChangeGroup.bind(this);
        this.onSaveGroup = this.onSaveGroup.bind(this);
        this.onToggleInactive = this.onToggleInactive.bind(this);
        this.onReload = this.onReload.bind(this);
    }

    componentDidMount() {
        if (!this.props.loading && this.props.list.length === 0) {
            this.props.dispatch(fetchGroups());
        }
    }

    onReload() {
        this.props.dispatch(fetchGroups());
    }

    onToggleInactive() {
        this.setState({
            showInactive: !this.state.showInactive
        });
    }

    onChangeFilter(val) {
        this.setState({
            filter: val,
        });
    }

    onClickSelected(group) {
        this.props.dispatch(selectGroup(group));
    }

    onClickNew() {
        this.onClickSelected({});
    }

    onChangeGroup(field, value) {
        this.props.dispatch(updateGroup(field, value));
    }

    onSaveGroup() {
        if (this.props.isAdmin) {
            this.props.dispatch(saveGroup(this.props.selected));
        }
    }


    render() {
        const {list, loading, selected, isAdmin, productLines} = this.props;
        const {filter, showInactive, rowsPerPage, page} = this.state;
        let reFilter;
        try {
            reFilter = new RegExp('\\b' + filter, 'i');
        } catch (err) {
            reFilter = /./i;
        }
        const rows = list
            .filter(group => showInactive || group.active)
            .filter(group => filter.trim() === '' || reFilter.test(group.code) || reFilter.test(group.description) || reFilter.test(group.notes || ''));


        return (
            <div className="row">
                <div className="col-sm-8">
                    <DataTableFilter filter={filter} showInactive={showInactive}
                                     onReload={this.onReload}
                                     onChangeFilter={this.onChangeFilter}
                                     onToggleInactive={this.onToggleInactive}>
                        <button type="btn" className="btn btn-sm btn-outline-secondary" onClick={this.onClickNew}>
                            New SKU Group
                        </button>
                    </DataTableFilter>
                    {loading && <ProgressBar striped={true} style={{height: '5px'}}/>}
                    <SortableTable fields={tableFields} data={rows} defaultSort="code"
                                   page={page} onChangePage={(page) => this.setState({page})}
                                   rowsPerPage={rowsPerPage}
                                   onChangeRowsPerPage={(rowsPerPage) => this.setState({rowsPerPage, page: 1})}
                                   onSelect={this.onClickSelected} selected={selected.code}
                    />
                </div>
                <div className="col-sm-4">
                    <GroupEditor group={selected} productLines={productLines} showInactive={showInactive}
                                 onChange={this.onChangeGroup}
                                 onSave={this.onSaveGroup}
                                 isAdmin={isAdmin}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {list, selected, loading} = state.groups;
    const {lines: productLines} = state.settings;
    const {isAdmin} = state.app;
    return {list, selected, loading, isAdmin, productLines};
};

export default connect(mapStateToProps)(GroupsTab);
