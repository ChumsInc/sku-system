/**
 * Created by steve on 3/22/2017.
 */
import {type ChangeEvent, type FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {saveColorUPC, selectCurrentColorUPC, selectLoading, selectSaving} from "./index";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import type {Editable, ProductColorUPCResponse} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";
import {formatGTIN} from '@chumsinc/gtin-tools';
import {defaultColorUPC} from "../../api/colorUPC";
import FormColumn from "@/components/FormColumn.tsx";
import TextArea from "@chumsinc/textarea";
import SpinnerButton from "@/components/SpinnerButton.tsx";
import Alert from "react-bootstrap/Alert";


const ColorUPCEditor = () => {
    const dispatch = useAppDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectCurrentColorUPC);
    const saving = useSelector(selectSaving);
    const loading = useSelector(selectLoading);
    const [colorUPC, setColorUPC] = useState<ProductColorUPCResponse & Editable>(selected ?? {...defaultColorUPC});

    useEffect(() => {
        setColorUPC({...(selected ?? defaultColorUPC)})
    }, [selected]);

    const onChangeItem = (ev: ChangeEvent<HTMLInputElement>) => {
        setColorUPC({...colorUPC, ItemCode: ev.target.value, changed: true});
    }


    const onChange = (field: keyof ProductColorUPCResponse) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setColorUPC({...colorUPC, [field]: ev.target.value, changed: true});
    }

    const onChangeActive = (active: boolean) => {
        setColorUPC({...colorUPC, active, changed: true});
    }

    const clickCheckDigitButton = () => {
        const upc = formatGTIN(colorUPC.upc, true);
        setColorUPC({...colorUPC, upc, changed: true});
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        const upc = formatGTIN(colorUPC.upc, true);
        dispatch(saveColorUPC({...colorUPC, upc}));
    }

    // @TODO: add alert for duplicate color UPC
    return (
        <div>
            <form className="form-horizontal" onSubmit={onSubmit}>
                <h3>Color UPC Editor</h3>
                <FormColumn label="Item Code">
                    <input type="text" readOnly={!isAdmin} value={colorUPC.ItemCode || ''}
                           className="form-control form-control-sm" minLength={2} maxLength={30}
                           required
                           onChange={onChangeItem}/>
                    <small className="text-muted">{colorUPC.ItemCodeDesc || ''}</small>
                </FormColumn>
                <FormColumn label="UPC">
                    <div className="input-group input-group-sm">
                        <input type="text" readOnly={!isAdmin} value={colorUPC.upc || ''}
                               onChange={onChange('upc')}
                               className="form-control form-control-sm"/>
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                title="Calculate Check Digit"
                                onClick={clickCheckDigitButton}>
                            <span className="bi-gear"/>
                        </button>
                    </div>
                    <small className="text-muted">Leave blank to assign the next by-color UPC.</small>
                </FormColumn>
                <FormColumn label="Notes">
                    <TextArea size="sm"
                        readOnly={!isAdmin} value={colorUPC.notes || ''} onChange={onChange('notes')}
                        minRows={3} />
                </FormColumn>
                <FormColumn label="Active">
                    <ActiveButtonGroup active={colorUPC.active} onChange={onChangeActive} disabled={!isAdmin}/>
                </FormColumn>
                <FormColumn label="">
                    <SpinnerButton type="submit" className="btn btn-sm btn-primary"
                                   spinning={saving} disabled={saving || loading || !isAdmin}>
                        Save
                    </SpinnerButton>
                </FormColumn>
                {colorUPC.changed && (
                    <Alert variant="warning">Don't forget to save your changes</Alert>
                )}
            </form>
            <hr/>
            <FormColumn label="Base UPC">
                <input type="text" readOnly={true} value={colorUPC.UDF_UPC ?? ''}
                       className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="By Color UPC">
                <input type="text" readOnly={true} value={colorUPC.UDF_UPC_BY_COLOR ?? ''}
                       className="form-control form-control-sm"/>
            </FormColumn>

        </div>
    )
}
export default ColorUPCEditor;
