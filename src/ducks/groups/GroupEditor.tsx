/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {defaultSKUGroup, saveSKUGroup, selectCurrentSKUGroup, selectLoading, selectSaving} from "./index";
import {Alert, FormColumn, Spinner, SpinnerButton} from "chums-components";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import ProductLineSelect from "../../components/ProductLineSelect";
import TextArea from 'react-textarea-autosize';
import {Editable, SKUGroup} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";


const GroupEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectCurrentSKUGroup);
    const saving = useSelector(selectSaving);
    const loading = useSelector(selectLoading);
    const [group, setGroup] = useState<SKUGroup & Editable>(selected ?? {...defaultSKUGroup});

    useEffect(() => {
        setGroup({...(selected ?? defaultSKUGroup)})
    }, [selected])

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => {
        setGroup({...group, code: ev.target.value.toUpperCase(), changed: true});
    }

    const onChange = (field: keyof SKUGroup) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setGroup({...group, [field]: ev.target.value, changed: true})
    }

    const onChangeActive = (active: boolean) => {
        setGroup({...group, active, changed: true});
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveSKUGroup(group));
    }

    // @TODO: add alert for duplicate sku group
    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Mix Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin} value={group.code}
                       className="form-control form-control-sm"
                       onChange={onChangeCode}/>
                <small className="text-muted">2 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={group.description}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
            </FormColumn>
            <FormColumn label="Product Line">
                <ProductLineSelect value={group.productLine} onChange={onChange('productLine')} disabled={!isAdmin}/>
            </FormColumn>

            <FormColumn label="Notes">
                <TextArea readOnly={!isAdmin} value={group.notes || ''} onChange={onChange('notes')}
                          className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="Active">
                <ActiveButtonGroup active={group.active} onChange={onChangeActive} disabled={!isAdmin}/>
            </FormColumn>
            <FormColumn label="">
                <SpinnerButton type="submit" size="sm" color="primary" spinning={saving}
                               disabled={saving||loading||!isAdmin}>
                    Save
                </SpinnerButton>
            </FormColumn>
            {group.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
export default GroupEditor;
