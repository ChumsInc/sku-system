/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent, useState} from 'react';
import GTIN from '../../GTIN';
import {useDispatch, useSelector} from "react-redux";
import {selectSelectedGroup, selectSelectedSKU, selectSelectedSKULoading} from "./selectors";
import {changeSKUAction, saveSKUAction} from "./actions";
import {selectIsAdmin} from "../users";
import {ProductSKUField} from "../../types";
import {FormColumn} from "chums-ducks";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import TextArea from 'react-textarea-autosize';

const SKUEditor: React.FC = () => {
    const dispatch = useDispatch();
    const selected = useSelector(selectSelectedSKU);
    const loading = useSelector(selectSelectedSKULoading);
    const isAdmin = useSelector(selectIsAdmin);
    const skuGroup = useSelector(selectSelectedGroup);

    const [upcBase, setUPCBase] = useState('093039');

    const onChangeNotes = (ev: ChangeEvent<HTMLTextAreaElement>) => dispatch(
        changeSKUAction({field: 'notes', value: ev.target.value})
    );

    const onBlurUPC = () => {
        const upc = GTIN.toString(selected.upc);
        dispatch(changeSKUAction({field: 'upc', value: upc}));
    }
    const onChange = (field: ProductSKUField) => (ev: ChangeEvent<HTMLInputElement>) => {
        // const value = GTIN.toString(ev.target.value);
        dispatch(changeSKUAction({field, value: ev.target.value}));
    }


    const onChangeActive = (active: boolean) => dispatch(changeSKUAction({field: 'active', value: active}));

    const onSaveSelected = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveSKUAction(selected));
    }
    const {
        id = 0,
        sku = '',
        upc = '',
        changed = false,
        sku_group_id = 0,
        description,
        notes = '',
        active = false
    } = selected;
    const formattedUPC = upc.substr(0, 2) === '45'
        ? GTIN.formatEAN13(upc, upc.length === 13)
        : GTIN.formatUPC(upc, upc.length === 12);

    return (
        <>
            <form className="form-horizontal" onSubmit={onSaveSelected}>
                <h3>SKU Editor</h3>
                <FormColumn label="SKU Group">
                    <input type="text" className="form-control form-control-sm"
                           value={`${skuGroup?.code || ''} - ${skuGroup?.description || ''}`} readOnly/>
                </FormColumn>
                <FormColumn label="SKU">
                    <input type="text" className="form-control form-control-sm"
                           value={selected.sku} readOnly={!isAdmin} onChange={onChange('sku')}/>
                    <small className="text-muted">Item Category 4 value.</small>
                </FormColumn>
                <FormColumn label="Description">
                    <input type="text" className="form-control form-control-sm"
                           value={selected.description} readOnly={!isAdmin} onChange={onChange('description')}/>
                    <small className="text-muted">To help you find it in the list.</small>
                </FormColumn>
                <FormColumn label="UPC">
                    <input type="text" className="form-control form-control-sm" list="sku-editor--default-sku-base"
                           // pattern="^(093039|000298|4538674)[0-9]{5,6}$"
                           value={selected.upc} readOnly={!isAdmin} onChange={onChange('upc')} onBlur={onBlurUPC}/>
                    <small className="text-muted">Generally the UDF_UPC value.</small>
                    <datalist id="sku-editor--default-sku-base">
                        <option value="093039">0 93039 ##### # - Chums</option>
                        <option value="000298">0 00298 ##### # - Chums</option>
                        <option value="094922">0 94922 ##### # - Beyond Coastal</option>
                        <option value="4538674">4 538674 ######- Chums Japan</option>
                    </datalist>
                </FormColumn>
                <FormColumn label="Notes">
                    <TextArea className="form-control form-control-sm" minRows={3}
                              readOnly={!isAdmin} onChange={onChangeNotes} value={selected.notes || ''}/>
                </FormColumn>
                <FormColumn label="Active">
                    <ActiveButtonGroup active={active} onChange={onChangeActive} disabled={!isAdmin}/>
                </FormColumn>
                <FormColumn label="">
                    <button type="submit" disabled={!isAdmin} className="btn btn-sm btn-primary">Save</button>
                </FormColumn>
            </form>

            <div className="card mt-3">
                <div className="card-body">
                    <h5 className="card-title">UPC Groups</h5>
                    <div className="card-text">
                        <ul>
                            <li>0 93039 - Chums</li>
                            <li>0 00298 - Chums</li>
                            <li>0 94922 - Beyond Coastal</li>
                            <li>4 538674 - Chums Japan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SKUEditor;
