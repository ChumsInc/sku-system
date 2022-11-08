/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {
    colorUPChangedAction,
    defaultColorUPC,
    fetchColorUPCAction,
    saveColorUPCAction,
    selectColorUPC,
    selectSaving
} from "./index";
import {ColorUPCField} from "../../types";
import {Alert, FormColumn, SpinnerButton} from "chums-ducks";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import CompanySelect from "../../components/CompanySelect";
import TextArea from 'react-textarea-autosize';
import {calcCheckDigit} from "./utils";


const ColorUPCEditor: React.FC = () => {
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectColorUPC);
    const isSaving = useSelector(selectSaving);

    const onChangeItem = (ev: ChangeEvent<HTMLInputElement>) => dispatch(colorUPChangedAction('ItemCode', ev.target.value.toUpperCase()));


    const onChange = (field: ColorUPCField) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        dispatch(colorUPChangedAction(field, ev.target.value));
    }

    const onChangeActive = () => dispatch(colorUPChangedAction('active', !selected.active));

    const clickCheckDigitButton = () => {
        const upc = calcCheckDigit(selected.upc);
        dispatch(colorUPChangedAction('upc', upc));
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        const upc = calcCheckDigit(selected.upc);
        dispatch(saveColorUPCAction({...selected, upc}));
    }

    const onClickNew = () => dispatch(fetchColorUPCAction(defaultColorUPC));

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
                    <div className="input-group input-group-sm">
                        <input type="text" readOnly={!isAdmin} value={selected.upc || ''} required onChange={onChange('upc')}
                               className="form-control form-control-sm"/>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clickCheckDigitButton}>
                            <span className="bi-gear" />
                        </button>
                    </div>
                    <small className="text-muted">Leave blank to assign the next by-color UPC.</small>
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
                    <div className="row g-3">
                        <div className="col-auto">
                            <SpinnerButton type="submit" className="btn btn-sm btn-primary" spinning={isSaving}>Save</SpinnerButton>
                        </div>
                        <div className="col-auto">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClickNew}>New</button>
                        </div>
                    </div>
                </FormColumn>
                {selected.changed && (
                    <Alert color="warning">Don't forget to save your changes</Alert>
                )}
            </form>
            <hr/>
            <FormColumn label="Base UPC">
                <input type="text" readOnly={true} value={selected.UDF_UPC ?? ''}
                       className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="By Color UPC">
                <input type="text" readOnly={true} value={selected.UDF_UPC_BY_COLOR ?? ''}
                       className="form-control form-control-sm"/>
            </FormColumn>

        </div>
    )
}
export default ColorUPCEditor;
