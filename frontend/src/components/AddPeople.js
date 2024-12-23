import React, {useState, useContext} from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';

import { useAPI } from '../custom-hooks/useAPI';
import { UserContext } from '../conetext/Context';

const AddPeople = ({company, closeModal}) => {
    const { getUserCompanies } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [role, setRole] = useState('editor');

    const { error, loading, cb: postDocument, data } = useAPI('POST', `/company/${company?.company_id}/add-user`);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await postDocument({email: email, role: role});
        await getUserCompanies();
        closeModal(false);
    };

    return (
    <Box>
        <form onSubmit={handleSubmit}>
        <Box sx={{display: 'flex', gap: '10px'}}>
            <TextField
                type='email'
                name='email'
                label='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
            /> 
            <TextField
                sx={{marginBottom: '15px'}}
                id='outlined-select-currency'
                select
                label='Role'
                helperText='Select the role'
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                >
                {['editor', 'user']?.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button type='submit' variant='contained' color='primary'>
                Add to the company
            </Button>
        </Box>
        </form>
    </Box>);
};

export default AddPeople;
