import {Fragment} from 'react';

export function ellipses(text: string, length?: number) {
    if (!text) {
        text = '';
    }
    if (!length) {
        length = 25;
    }
    return `${text.slice(0, length)}${text.length > length ? '...' : ''}`;
}

export interface TrimmedTextProps {
    text: string,
    length?: number,
}

const TrimmedText = ({text, length = 25}: TrimmedTextProps) => {
    return (<Fragment>{ellipses(text, length)}</Fragment>)
};

export default TrimmedText;
