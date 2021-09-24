import React, {Fragment} from 'react';
import {ellipses} from "../utils";

const TrimmedText = ({text, length=35}) => {
    return (<Fragment>{ellipses(text, length)}</Fragment>)
};

export default TrimmedText;
