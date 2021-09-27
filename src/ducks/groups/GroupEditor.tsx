/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {groupChangedAction, saveGroupAction, selectSelectedSKUGroup} from "./index";
import {ProductMixField, SKUGroupField} from "../../types";
import {Alert, FormColumn} from "chums-ducks";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import ProductLineSelect from "../../components/ProductLineSelect";
import TextArea from 'react-textarea-autosize';


const GroupEditor: React.FC = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectSelectedSKUGroup);

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => dispatch(groupChangedAction('code', ev.target.value.toUpperCase()));

    const onChange = (field: SKUGroupField) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch(groupChangedAction(field, ev.target.value));
    }

    const onChangeActive = () => dispatch(groupChangedAction('active', !selected.active));

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveGroupAction(selected));
    }

    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Mix Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin} value={selected.code}
                       className="form-control form-control-sm"
                       onChange={onChangeCode}/>
                <small className="text-muted">2 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={selected.description}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
            </FormColumn>
            <FormColumn label="Product Line">
                <ProductLineSelect value={selected.productLine} onChange={onChange('productLine')} disabled={!isAdmin} />
            </FormColumn>

            <FormColumn label="Notes">
                <TextArea readOnly={!isAdmin} value={selected.notes || ''} onChange={onChange('notes')}
                          className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="Active">
                <ActiveButtonGroup active={selected.active} onChange={onChangeActive} disabled={!isAdmin}/>
            </FormColumn>
            <FormColumn label="">
                <button type="submit" className="btn btn-sm btn-primary">Save</button>
            </FormColumn>
            {selected.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
export default GroupEditor;
