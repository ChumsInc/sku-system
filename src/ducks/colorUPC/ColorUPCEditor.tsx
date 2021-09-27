/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {colorUPChangedAction, saveColorUPCAction, selectColorUPC} from "./index";
import {ColorUPCField} from "../../types";
import {Alert, FormColumn} from "chums-ducks";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import CompanySelect from "../../components/CompanySelect";
import TextArea from 'react-textarea-autosize';


const ColorUPCEditor: React.FC = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectColorUPC);

    const onChangeItem = (ev: ChangeEvent<HTMLInputElement>) => dispatch(colorUPChangedAction('ItemCode', ev.target.value.toUpperCase()));


    const onChange = (field: ColorUPCField) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch(colorUPChangedAction(field, ev.target.value));
    }

    const onChangeActive = () => dispatch(colorUPChangedAction('active', !selected.active));

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveColorUPCAction(selected));
    }

    return (
        <div>
            <form className="form-horizontal" onSubmit={onSubmit}>
                <h3>Color UPC Editor</h3>
                <FormColumn label="Company">
                    <CompanySelect value={selected.company || ''} disabled={!isAdmin} onChange={onChange('company')}/>
                </FormColumn>
                <FormColumn label="Item Code">
                    <input type="text" readOnly={!isAdmin} value={selected.ItemCode || ''}
                           className="form-control form-control-sm" minLength={2} maxLength={10}
                           required
                           onChange={onChangeItem}/>
                    <small className="text-muted">{selected.ItemCodeDesc || ''}</small>
                </FormColumn>
                <FormColumn label="UPC">
                    <input type="text" readOnly={!isAdmin} value={selected.upc} required
                           className="form-control form-control-sm"/>
                </FormColumn>
                <FormColumn label="Notes">
                    <TextArea readOnly={!isAdmin} value={selected.notes || ''} onChange={onChange('notes')}
                              minRows={3}
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
            <hr/>
            <FormColumn label="Base UPC">
                <input type="text" readOnly={true} value={selected.UDF_UPC}
                       className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="By Color UPC">
                <input type="text" readOnly={true} value={selected.UDF_UPC_BY_COLOR}
                       className="form-control form-control-sm"/>
            </FormColumn>

        </div>
    )
}
export default ColorUPCEditor;
