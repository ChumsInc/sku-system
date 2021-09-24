import React, {Component, Fragment} from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import RowsPerPage from "./RowsPerPage";
import FormGroup from "./FormGroup";
import SortableTableHeader from "./SortableTableHeader";
import SortableTableFooter from "./SortableTableFooter";
import {noop} from '../utils';


const getClassName = (className, val) => {
    switch (typeof className) {
    case 'function':
        const _className = className(val);
        if (typeof _className === 'object') {
            return {
                ..._className,
            };
        }
        return {[_className]: true};
    case 'object':
        return {...className};
    default:
        return {[className]: true};
    }
};


const TableRowField = ({col, row}) => {
    const _className = col.className ? getClassName(col.className) : {};
    if (typeof col.render === 'function') {
        return (<td className={classNames(_className)}>{col.render(row)}</td>);
    }
    return (<td className={classNames(_className)}>{row[col.field]}</td>);
};

class TableRow extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        row: PropTypes.any,
        active: PropTypes.bool,
        onClick: PropTypes.func,
        className: PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.string]),

    };

    render() {
        const {fields, row, active, onClick, className} = this.props;
        const rowClassName = getClassName(className, row);
        const _className = {
            'table-active': active,
            ...rowClassName
        };
        return (
            <tr onClick={() => onClick(row)} className={classNames(_className)}>
                {fields.map((col, index) => <TableRowField key={index} col={col} row={row}/>)}
            </tr>
        );
    }
}

export default class SortableTable extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf(PropTypes.shape({
            field: PropTypes.string.isRequired,
            title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
            noSort: PropTypes.bool,
            render: PropTypes.func,
            className: PropTypes.string,
        })),
        data: PropTypes.array.isRequired,
        hasFooter: PropTypes.bool,
        footerData: PropTypes.object,
        keyField: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        selected: PropTypes.any,
        hasPageIndicators: PropTypes.bool,
        onSelect: PropTypes.func,
        sorter: PropTypes.func,
        defaultSort: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool
        })]),
        sort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }),
        page: PropTypes.number,
        rowsPerPage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        filtered: PropTypes.bool,
        rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
        className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        displayPageSelectorInline: PropTypes.bool,

        onChangeSort: PropTypes.func,
        onChangePage: PropTypes.func,
        onChangeRowsPerPage: PropTypes.func,
    };

    static defaultProps = {
        fields: [],
        data: [],
        hasFooter: false,
        footerData: {},
        keyField: 'id',
        hasPageIndicators: true,
        defaultSort: '',
        sort: {
            field: '',
            asc: true
        },
        page: 1,
        rowsPerPage: 25,
        filtered: false,
        rowClassName: '',
        className: '',
        displayPageSelectorInline: true,

        onChangeSort: noop,
        onChangePage: noop,
        onChangeRowsPerPage: noop,
    };

    state = {
        sort: {
            field: '',
            asc: true,
        },
        page: 1,
        perPage: 25,
    };

    constructor(props) {
        super(props);
        this.onClickSort = this.onClickSort.bind(this);
        this.onSelectRow = this.onSelectRow.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.sorter = this.sorter.bind(this);
    }

    componentDidMount() {
        const {defaultSort} = this.props;
        if (typeof defaultSort === 'object') {
            this.setState({sort: defaultSort});
        } else {
            this.setState({sort: {field: defaultSort, asc: true}});
        }
    }


    onClickSort(nextField) {
        const {sort} = this.state;
        if (sort.field === nextField) {
            sort.asc = !sort.asc;
            this.setState({sort});
        } else {
            this.setState({sort: {field: nextField, asc: true}});
        }
        this.props.onChangeSort();
    }

    onSelectRow(row) {
        if (this.props.onSelect) {
            this.props.onSelect(row);
        }
    }

    handlePageChange(page) {
        this.props.onChangePage(page);
    }

    sorter(list) {
        const {field, asc} = this.state.sort;
        const {fields, sorter} = this.props;

        const [sort] = fields.filter(f => f.field === field).map(col => col.sort || col.sorter || col.sortFn);
        if (!sort && typeof sorter === 'function') {
            return sorter({list, field, asc});
        }
        return list.sort((a, b) => {
            const aa = sort ? sort(a) : (typeof (a[field]) === 'number' ? a[field] : String(a[field]).toLowerCase());
            const bb = sort ? sort(b) : (typeof (b[field]) === 'number' ? b[field] : String(b[field]).toLowerCase());
            return (aa === bb ? 0 : (aa > bb ? 1 : -1)) * (asc ? 1 : -1);
        })
    }


    render() {
        const {fields, data, className, page, rowsPerPage, keyField, filtered, selected, hasFooter, footerData, rowClassName, displayPageSelectorInline} = this.props;
        const {sort} = this.state;
        const rows = this.sorter(data);
        const pages = Math.ceil(rows.length / rowsPerPage);
        const colWidth = displayPageSelectorInline === false ? 9 : undefined;

        return (
            <Fragment>
                <table className={classNames("table table-sm table-hover table-sortable table-sticky", className)}>
                    <SortableTableHeader fields={fields} sort={sort} onClickSort={this.onClickSort}/>
                    {!!hasFooter &&
                    <SortableTableFooter fields={fields} footerData={footerData} page={page} pages={pages}/>}
                    <tbody>
                    {rows
                        .filter((row, index) => Math.ceil((index + 1) / rowsPerPage) === page)
                        .map(row => {
                            const key = typeof keyField === "function" ? keyField(row) : row[keyField];
                            return (
                                <TableRow key={key} row={row} fields={fields}
                                          className={rowClassName} active={key === selected}
                                          onClick={() => this.onSelectRow(row)}/>
                            );
                        })
                    }
                    </tbody>
                </table>
                <div className={classNames("page-display", {'form-inline': displayPageSelectorInline})}>
                    <RowsPerPage value={rowsPerPage} onChange={this.props.onChangeRowsPerPage} colWidth={colWidth}/>
                    <FormGroup label="Pages" colWidth={colWidth}>
                        {rows.length > 0 && <Pagination activePage={page} pages={Math.ceil(rows.length / rowsPerPage)}
                                                        onSelect={this.handlePageChange} filtered={filtered}/>}
                        {rows.length === 0 && <strong>No records.</strong>}
                    </FormGroup>
                </div>
            </Fragment>
        );
    }
}
