/**
 * Created by steve on 3/22/2017.
 */
import React, {ChangeEvent, FormEvent, useState} from 'react';
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../users";
import {saveProductColor, selectCurrentColor} from "./index";
import {Alert, FormColumn} from "chums-components";
import ActiveButtonGroup from "../../components/ActiveButtonGroup";
import {defaultProductColor} from "../../api/color";
import {Editable, ProductColor} from "chums-types";
import {useAppDispatch} from "../../app/configureStore";


const ColorEditor: React.FC = () => {
    const dispatch = useAppDispatch();
    const isAdmin = useSelector(selectIsAdmin);
    const selected = useSelector(selectCurrentColor);

    const [color, setColor] = useState<ProductColor & Editable>(selected ?? {...defaultProductColor})

    const onChangeCode = (ev: ChangeEvent<HTMLInputElement>) => {
        setColor({...color, code: ev.target.value.toUpperCase(), changed: true});

    }
    const onChange = (field: keyof ProductColor) => (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setColor({...color, [field]: ev.target.value, changed: true})
    }

    const onChangeActive = (active: boolean) => {
        setColor({...color, active, changed: true})
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        dispatch(saveProductColor(color));
    }

    return (
        <form className="form-horizontal" onSubmit={onSubmit}>
            <h3>Color Editor</h3>
            <FormColumn label="Code">
                <input type="text" readOnly={!isAdmin} value={color.code}
                       className="form-control form-control-sm"
                       pattern="\S{3,5}" maxLength={5} title="3-5 Characters"
                       onChange={onChangeCode}/>
                <small className="text-muted">3-5 Characters</small>
            </FormColumn>
            <FormColumn label="Description">
                <input type="text" readOnly={!isAdmin} value={color.description}
                       className="form-control form-control-sm"
                       onChange={onChange('description')}/>
            </FormColumn>
            <FormColumn label="Notes">
                <textarea readOnly={!isAdmin} value={color.notes || ''} onChange={onChange('notes')}
                          className="form-control form-control-sm"/>
            </FormColumn>
            <FormColumn label="Active">
                <ActiveButtonGroup active={color.active} onChange={onChangeActive} disabled={!isAdmin}/>
            </FormColumn>
            <FormColumn label="">
                <button type="submit" className="btn btn-sm btn-primary">Save</button>
            </FormColumn>
            {color.changed && (
                <Alert color="warning">Don't forget to save your changes</Alert>
            )}
        </form>
    )
}
export default ColorEditor;
