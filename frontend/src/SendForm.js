import React, { useState } from 'react';

import { useAPI } from './custom-hooks/useAPI.js';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

const SendForm = () => {
    const [inputValue, setInputValue] = useState('');
    const { error, loading, cb: postDocument, data } = useAPI('POST', '/api/v1/documents');

    const handleSubmit = (e) => {
        e.preventDefault();
        postDocument({ data: inputValue });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                type='text'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <Button type='submit' variant='contained' color='primary'>
                Send
            </Button>
            {loading && <CircularProgress />}
            {error && (
                <Typography variant='subtitle1' color='error'>
                    Error: {error}
                </Typography>
            )}
            {data && (
                <Typography variant='subtitle1'>
                    Data: {JSON.stringify(data)}
                </Typography>
            )}
        </form>
    );
};

export default SendForm;
