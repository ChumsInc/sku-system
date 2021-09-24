/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent} from 'react';
import classNames from 'classnames';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {colorChangedAction, saveColorAction, selectColor} from "./index";
import {ProductColorField} from "../../types";
import {Alert, FormColumn} from "chums-ducks";


const ColorEditor: React.FC = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectColor);

    const onChange = (field: ProductColorField) => (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(colorChangedAction(field, ev.target.value));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveColorAction(selected));
    }

    const {id, code, description, notes, active, changed = false} = selected;
    let alerts = [];
    if (changed) {
        alerts.push(<Alert key="alert-changed" dismissible={true} state='warning'>Don't forget to save your
            changes</Alert>);
    }

    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Color Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin}
                       pattern="\S{2,5}" maxLength={5} title="2-5 Characters"
                       onChange={onChange('code')} />
                <small className="text-muted">2-5 Characters</small>
            </FormColumn>
            <FormColumn label="Description"></FormColumn>
            <FormColumn label="Notes"></FormColumn>
            <FormColumn label="Active"></FormColumn>
            <FormColumn label="Description"></FormColumn>
            <FormControlGroup type="text" value={description || ''} label="Description" colWidth={8}
                              readOnly={!isAdmin}
                              onChange={this.onChange.bind(this, 'description')}/>
            <FormControlGroup type="textarea" value={notes || ''} label="Notes" colWidth={8}
                              readOnly={!isAdmin}
                              onChange={this.onChange.bind(this, 'notes')}/>
            <FormControlGroup type="" label="Active" colWidth={8}>
                <button type="button"
                        className={classNames('btn', {'btn-success': active, 'btn-outline-success': !active})}
                        disabled={!isAdmin}
                        onClick={() => this.onChange('active', true)}>Yes
                </button>
                <button type="button"
                        className={classNames('btn', {'btn-outline-danger': active, 'btn-danger': !active})}
                        disabled={!isAdmin}
                        onClick={() => this.onChange('active', false)}>No
                </button>
            </FormControlGroup>
            <FormControlGroup type="null" colWidth={8}>
                <button type="button" disabled={!isAdmin} className="btn btn-primary"
                        onClick={this.onSaveSelected}>Save
                </button>
            </FormControlGroup>
            {changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
