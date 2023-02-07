import React, {useEffect} from 'react';
import {redirect, useNavigate} from "react-router-dom";

export default function IndexRedirect() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/sku', {replace: true});
    }, [])
    return null;
}
