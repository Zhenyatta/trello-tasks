import React, { useState, useEffect, useContext } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

import { useAPI } from '../custom-hooks/useAPI.js';
import { UserContext } from '../conetext/Context.js';

const CreateCompany = ({userId, setOpenAddCompany}) => {
    const { user, getUserCompanies } = useContext(UserContext);
    
    const [tin, setTin] = useState('');
    const [name, setName] = useState('');
    const [companies, setCompanies] = useState(null);

    const { error, loading, cb: postDocument, data } = useAPI('POST', '/company');

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            await postDocument({tin: +tin, name, userId: user?.id});
            await getUserCompanies();
            setOpenAddCompany(false);
        } catch(err) {
            console.error(err);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Box sx={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                    <TextField
                        type='text'
                        name='name'
                        label='Compant Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    /> 
                    <TextField
                        type='number'
                        name='tin'
                        label='Company Tin'
                        value={tin}
                        onChange={(e) => setTin(e.target.value)}
                        fullWidth
                    />
                </Box>
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button type='submit' variant='contained' color='primary'>
                        Create Company
                    </Button>
                </Box>
            </form>
        </>
    );
};

export default CreateCompany;
