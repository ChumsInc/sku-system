/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentSKU, selectLoading, selectSaving} from "./selectors";
import {removeSKU, saveSKU} from "./actions";
import {selectIsAdmin} from "../users";
import {FormColumn, SpinnerButton} from "chums-components";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import {TextareaAutosize} from '@mui/base';
import SKUGroupSelect from "../groups/SKUGroupSelect";
import {BaseSKU, Editable, SKUGroup} from "chums-types";
import {defaultBaseSKU} from "../../api/sku";
import {formatGTIN} from "@chumsinc/gtin-tools";
import {useAppDispatch} from "../../app/configureStore";

const SKUEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const selected = useSelector(selectCurrentSKU);
    const loading = useSelector(selectLoading);
    const saving = useSelector(selectSaving);
    const isAdmin = useSelector(selectIsAdmin);
    const [baseSKU, setBaseSKU] = useState<BaseSKU & Editable>({...(selected ?? defaultBaseSKU)});

    useEffect(() => {
        setBaseSKU({...(selected ?? defaultBaseSKU)})
    }, [selected])

    const onChangeNotes = (ev: ChangeEvent<HTMLTextAreaElement>) => {
        setBaseSKU({...baseSKU, notes: ev.target.value, changed: true});
    }

    const onBlurUPC = () => {
        const upc = formatGTIN(baseSKU.upc ?? '', true);
        setBaseSKU({...baseSKU, upc, changed: true});
    }
    const onChange = (field: keyof BaseSKU) => (ev: ChangeEvent<HTMLInputElement>) => {
        setBaseSKU({...baseSKU, [field]: ev.target.value, changed: true});
    }

    const onChangeSKUGroup = (group: SKUGroup | undefined) => {
        setBaseSKU({...baseSKU, sku_group_id: group?.id ?? 0, changed: true})
    }

    const onChangeActive = (active: boolean) => {
        setBaseSKU({...baseSKU, active, changed: true})
    }

    const onSaveSelected = (ev: FormEvent) => {
        ev.preventDefault();
        if (!isAdmin) {
            return;
        }
        dispatch(saveSKU(baseSKU));
    }

    const deleteSKUHandler = () => {
        if (!isAdmin) {
            return;
        }
        dispatch(removeSKU(baseSKU));
    }

    // @TODO: add alert for duplicate base sku
    return (
        <>
            <form className="form-horizontal" onSubmit={onSaveSelected}>
                <h3>SKU Editor</h3>
                <FormColumn label="SKU Group">
                    <SKUGroupSelect onChange={onChangeSKUGroup} value={baseSKU.sku_group_id} required/>
                </FormColumn>
                <FormColumn label="Base SKU">
                    <input type="text" className="form-control form-control-sm"
                           value={baseSKU.sku ?? ''} readOnly={!isAdmin} onChange={onChange('sku')}/>
                    <small className="text-muted">Item Category 4 value.</small>
                </FormColumn>
                <FormColumn label="Description">
                    <input type="text" className="form-control form-control-sm"
                           value={baseSKU.description ?? ''} readOnly={!isAdmin} onChange={onChange('description')}/>
                    <small className="text-muted">To help you find it in the list.</small>
                </FormColumn>
                <FormColumn label="UPC">
                    <input type="text" className="form-control form-control-sm" list="sku-editor--default-sku-base"
                        // pattern="^(093039|000298|4538674)[0-9]{5,6}$"
                           value={baseSKU.upc ?? ''} readOnly={!isAdmin} onChange={onChange('upc')} onBlur={onBlurUPC}/>
                    <small className="text-muted">Generally the UDF_UPC value.</small>
                    <datalist id="sku-editor--default-sku-base">
                        <option value="093039">0 93039 ##### # - Chums</option>
                        <option value="000298">0 00298 ##### # - Chums</option>
                        <option value="094922">0 94922 ##### # - Beyond Coastal</option>
                        <option value="4538674">4 538674 ######- Chums Japan</option>
                    </datalist>
                </FormColumn>
                <FormColumn label="Notes">
                    <TextareaAutosize className="form-control form-control-sm" minRows={3}
                                      readOnly={!isAdmin} onChange={onChangeNotes} value={baseSKU.notes || ''}/>
                </FormColumn>
                <FormColumn label="Active">
                    <ActiveButtonGroup active={baseSKU.active ?? true} onChange={onChangeActive} disabled={!isAdmin}/>
                </FormColumn>
                <FormColumn label="" className="mb-3">
                    <div className="row g-3">
                        <div className="col-auto">
                            <SpinnerButton type="submit" color="primary" size="sm"
                                           disabled={!isAdmin || loading || !baseSKU.sku_group_id || !baseSKU.sku}
                                           spinning={saving}>
                                Save
                            </SpinnerButton>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-sm btn-outline-danger" type="button"
                                    disabled={!isAdmin || loading || !baseSKU.id || baseSKU.changed}
                                    onClick={deleteSKUHandler}>
                                Delete SKU
                            </button>
                        </div>
                    </div>
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
