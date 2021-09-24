/**
 * Created by steve on 3/22/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormControlGroup from '../chums-components/FormControlGroup';
import Alert from '../chums-components/Alert';
import classNames from 'classnames';
import {ProductLineOptions} from "./common";


export default class GroupEditor extends Component {
    static propTypes = {
        group: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        isAdmin: PropTypes.bool,
        productLines: PropTypes.array,
        showInactive: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.onChangeSelected = this.onChangeSelected.bind(this);
        this.onSaveSelected = this.onSaveSelected.bind(this);
    }

    onChangeSelected(field, value) {
        this.props.onChange(field, value);
    }

    onSaveSelected(ev) {
        ev.preventDefault();
        this.props.onSave(this.props.group);
    }

    render() {
        const {id, code, description, notes, active, changed = false, productLine = ''} = this.props.group;
        const {group, isAdmin, productLines, showInactive = false} = this.props;
        const selected = this.selected;

        let alerts = [];
        if (changed) {
            alerts.push(<Alert key="alert-changed" dismissible={true} state='warning'>Don't forget to save your changes</Alert>);
        }


        return (
            <form className="form-horizontal" onSubmit={this.onSaveSelected}>
                <h3>SKU Group Editor</h3>
                <div className="debug">
                    <FormControlGroup type="text" value={id || '0'} label="ID" colWidth={8} readOnly small/>
                </div>
                <FormControlGroup type="text" value={code || ''} label="SKU Group" colWidth={8} required small
                                  maxLength="64"
                                  onChange={this.onChangeSelected.bind(this, 'code')}/>
                <FormControlGroup type="text" value={description || ''} label="Description" colWidth={8} small
                                  onChange={this.onChangeSelected.bind(this, 'description')}/>
                <FormControlGroup type="" small colWidth={8} label="Default Product Line">
                    <select className="form-control form-control-sm" value={productLine || ''} onChange={(ev) => this.onChangeSelected('productLine', ev.target.value)}>
                        <option>Select Product Line</option>
                        <ProductLineOptions productLines={productLines} showInactive={showInactive}/>
                    </select>
                </FormControlGroup>
                <FormControlGroup type="textarea" value={notes || ''} label="Notes" colWidth={8} small
                                  onChange={this.onChangeSelected.bind(this, 'notes')}/>
                <FormControlGroup type="" label="Active" colWidth={8} small>
                    <button type="button" className={classNames('btn', {'btn-success': active, 'btn-outline-success': !active})}
                            onClick={() => this.onChangeSelected('active', true)}>Yes</button>
                    <button type="button" className={classNames('btn', {'btn-outline-danger': active, 'btn-danger': !active})}
                            onClick={() => this.onChangeSelected('active', false)}>No</button>
                </FormControlGroup>
                <FormControlGroup type="null" colWidth={8} small>
                    <button type="submit" disabled={!isAdmin} className="btn btn-primary" onClick={this.onSaveSelected}>Save</button>
                </FormControlGroup>
                {alerts}
            </form>
        )
    }
}
