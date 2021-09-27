import React, {Fragment} from 'react';

export function ellipses(text:string, length?:number) {
    if (!text) {
        text = '';
    }
    if (!length) {
        length = 25;
    }
    return `${text.substr(0, length)}${text.length > length ? '...' : ''}`;
}

export interface TrimmedTextProps {
    text: string,
    length?: number,
}
const TrimmedText:React.FC<TrimmedTextProps> = ({text, length= 25}) => {
    return (<Fragment>{ellipses(text, length)}</Fragment>)
};

export default TrimmedText;
