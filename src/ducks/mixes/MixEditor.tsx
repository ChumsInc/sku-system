/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {saveMix, selectCurrentMix, selectMixLoading, selectMixSaving} from "./index";
import {Alert, FormColumn, SpinnerButton} from "chums-components";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import TextArea from 'react-textarea-autosize';
import {useAppDispatch} from "../../app/configureStore";
import {Editable, ProductMixInfo} from "chums-types";
import {emptyMix} from "../../api/mixes";


const MixEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectCurrentMix);
    const isSaving = useSelector(selectMixSaving);
    const isLoading = useSelector(selectMixLoading);
    const [mix, setMix] = useState<ProductMixInfo & Editable>({...(selected ?? emptyMix)});

    useEffect(() => {
        setMix({...(selected ?? emptyMix)});
    }, [selected]);

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => {
        setMix({...mix, code: ev.target.value.toUpperCase(), changed: true});
    }

    const onChange = (field: keyof ProductMixInfo) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setMix({...mix, [field]: ev.target.value, changed: true});
    }

    const onChangeActive = (active: boolean) => {
        setMix({...mix, active, changed: true});
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveMix(mix));
    }

    // @TODO: add alert for duplicate mix code
    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Mix Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin} value={mix.code}
                       className="form-control form-control-sm"
                       pattern="\[\da-z]\{2}" maxLength={2} minLength={2} title="2 Characters"
                       onChange={onChangeCode}/>
                <small className="text-muted">2 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={mix.description}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
            </FormColumn>
            <FormColumn label="Notes">
                <TextArea readOnly={!isAdmin} value={mix.notes || ''} onChange={onChange('notes')}
                          className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="Active">
                <ActiveButtonGroup active={mix.active} onChange={onChangeActive} disabled={!isAdmin}/>
            </FormColumn>
            <FormColumn label="">
                <SpinnerButton type="submit" color="primary" spinning={isSaving} size="sm"
                               disabled={!isAdmin || isSaving || isLoading}>
                    Save
                </SpinnerButton>
            </FormColumn>
            {mix.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
export default MixEditor;
