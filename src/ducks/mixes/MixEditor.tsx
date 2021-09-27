/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {mixChangedAction, saveMixAction, selectMix} from "./index";
import {ProductMixField} from "../../types";
import {Alert, FormColumn} from "chums-ducks";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import TextArea from 'react-textarea-autosize';


const MixEditor: React.FC = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectMix);

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => dispatch(mixChangedAction('code', ev.target.value.toUpperCase()));

    const onChange = (field: ProductMixField) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(mixChangedAction(field, ev.target.value));
    }

    const onChangeActive = () => dispatch(mixChangedAction('active', !selected.active));

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveMixAction(selected));
    }

    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Mix Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin} value={selected.code}
                       className="form-control form-control-sm"
                       pattern="\[\da-z]\{2}" maxLength={2} minLength={2} title="2 Characters"
                       onChange={onChangeCode}/>
                <small className="text-muted">2 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={selected.description}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
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
export default MixEditor;
