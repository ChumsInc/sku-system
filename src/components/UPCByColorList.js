/**
 * Created by steve on 3/29/2017.
 */

import React, {Component, Fragment} from 'react';
import GTIN from '../GTIN';
import DataTableFilter from '../chums-components/DataTableFilter';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {fetchColorUPCList, getNextByColorUPC, selectColorUPC} from "../actions/colorUPC";
import SortableTable from "../chums-components/SortableTable";
import ProgressBar from "../chums-components/ProgressBar";
import TrimmedText from "./TrimmedText";

const tableFields = [
    {field: 'company', title: 'Company'},
    {field: 'ItemCode', title: 'Item Code'},
    {field: 'ItemCodeDesc', title: 'Desc'},
    {field: 'ProductType', title: 'Type'},
    {field: 'upc', title: 'UPC', render: (row) => GTIN.format(row.upc), className: 'upc'},
    {field: 'notes', title: 'Notes', render: (row) => (<TrimmedText text={row.notes}/>)},
    {
        field: 'UDF_UPC_BY_COLOR',
        title: 'match',
        render: (row) => row.upc === row.UDF_UPC_BY_COLOR ? 'Y' : 'N',
        noSort: true
    }
];


class UPCByColorList extends Component {
    static propTypes = {
        list: PropTypes.array.isRequired,
        selected: PropTypes.object,
        loading: PropTypes.bool,
        isAdmin: PropTypes.bool,

        selectColorUPC: PropTypes.func,
        getNextByColorUPC: PropTypes.func,
        fetchColorUPCList: PropTypes.func,
    };

    static defaultProps = {
        list: [],
        selected: {id: 0},
        loading: false,
        isAdmin: false,
    };

    state = {
        filter: '',
        showInactive: false,
        rowsPerPage: 10,
        currentPage: 1,
    };

    constructor(props) {
        super(props);
        this.onChangeFilter = this.onChangeFilter.bind(this);
        this.onClickNew = this.onClickNew.bind(this);
        this.onChangeRows = this.onChangeRows.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onToggleInactive = this.onToggleInactive.bind(this);
        this.onReload = this.onReload.bind(this);
    }

    componentDidMount() {
        if (this.props.list.length === 0) {
            this.onReload();
        }
    }

    onReload() {
        this.props.fetchColorUPCList();
    }


    onToggleInactive() {
        this.setState({
            showInactive: !this.state.showInactive
        });
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

    onSelect(upc) {
        this.props.selectColorUPC(upc);
    }

    onClickNew() {
        this.props.getNextByColorUPC();
    }

    render() {
        const {filter, rowsPerPage, showInactive, currentPage} = this.state;
        const {list, isAdmin, loading, selected} = this.props;
        const notes = '';
        let reFilter;
        let upcFilter;
        try {
            reFilter = new RegExp('\\b' + filter, 'i');
            upcFilter = new RegExp(filter, 'i');
        } catch (err) {
            reFilter = /./i;
            upcFilter = /./i;
        }
        const rows = list
            .filter(item => showInactive || item.active)
            .filter(item => {
                return item.id === 0
                    || filter.trim() === ''
                    || reFilter.test(item.ItemCode)
                    || upcFilter.test(item.upc)
                    || reFilter.test(item.notes || '')
            });

        return (
            <Fragment>
                <DataTableFilter filter={filter} showInactive={showInactive}
                                 onReload={this.onReload}
                                 onChangeFilter={this.onChangeFilter}
                                 onToggleInactive={this.onToggleInactive}>
                    <button type="btn" className="btn btn-sm btn-outline-secondary order-3" onClick={this.onClickNew}
                            disabled={1 === 0}>
                        New Color UPC
                    </button>
                    {notes}
                </DataTableFilter>
                {loading && <ProgressBar striped={true} style={{height: '5px'}}/>}
                <SortableTable fields={tableFields} data={rows} defaultSort="ItemCode"
                               keyField="id"
                               onSelect={this.onSelect} selected={selected.id}
                               rowsPerPage={rowsPerPage}
                               onChangeRowsPerPage={(rowsPerPage) => this.setState({rowsPerPage})}
                               page={currentPage}
                               onChangePage={(currentPage) => this.setState({currentPage})}/>
            </Fragment>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {list, selected, loading} = state.colorUPC;
    const {isAdmin} = state.app;
    return {list, selected, loading, isAdmin};
};

const mapPropsToDispatch = {
    selectColorUPC,
    getNextByColorUPC,
    fetchColorUPCList,
};

export default connect(mapStateToProps, mapPropsToDispatch)(UPCByColorList);
