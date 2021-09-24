/**
 * Created by steve on 3/22/2017.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../chums-components/Alert';
import FormControlGroup from '../chums-components/FormControlGroup';
import classNames from 'classnames';

export default class MixEditor extends Component {
    static propTypes = {
        mix: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        isAdmin: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSaveSelected = this.onSaveSelected.bind(this);
    }


    onChange(field, value) {
        this.props.onChange(field, value);
    }

    onSaveSelected(ev) {
        ev.preventDefault();
        if (!this.props.isAdmin) {
            return;
        }

        this.props.onSave();
    }

    render() {
        const {id, code, description, notes, active, changed = false} = this.props.mix;
        const {mix, isAdmin} = this.props;

        let alerts = [];
        if (changed) {
            alerts.push(<Alert key="alert-changed" dismissible={true} state='warning'>Don't forget to save your changes</Alert>);
        }

        return (
            <form className="form-horizontal" onSubmit={this.onSaveSelected}>
                <h3>Mix Editor</h3>
                <div className="debug">
                    <FormControlGroup type="text" value={id || ''} label="ID" colWidth={8} readOnly/>
                </div>
                <FormControlGroup type="text" value={code || ''} label="Code" colWidth={8} required
                                  pattern="\S{2,5}" maxLength="5" title="2-5 Characters"
                                  onChange={this.onChange.bind(this, 'code')}/>
                <FormControlGroup type="text" value={description || ''} label="Description" colWidth={8}
                                  onChange={this.onChange.bind(this, 'description')}/>
                <FormControlGroup type="textarea" value={notes || ''} label="Notes" colWidth={8}
                                  onChange={this.onChange.bind(this, 'notes')}/>
                <FormControlGroup type="" label="Active" colWidth={8}>
                    <button type="button" className={classNames('btn', {'btn-success': active, 'btn-outline-success': !active})}
                            onClick={() => this.onChange('active', true)}>Yes</button>
                    <button type="button" className={classNames('btn', {'btn-outline-danger': active, 'btn-danger': !active})}
                            onClick={() => this.onChange('active', false)}>No</button>
                </FormControlGroup>
                <FormControlGroup type="null" colWidth={8}>
                    <button type="button" disabled={!isAdmin} className="btn btn-primary" onClick={this.onSaveSelected}>Save</button>
                </FormControlGroup>
                {alerts}
            </form>
        )
    }
}
