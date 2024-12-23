import React, {useState} from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { FormControl } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Box} from '@mui/material';

import { useAPI } from '../custom-hooks/useAPI.js';
import { intervals } from '../constants/intervals.js';

// item_name,
//       item_type,
//       purchase_date,
//       maintenance_interval,
//       company_id,
//       user_id,

const CreateItem = ({user, setOpenAddItem}) => {

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [purchaseDate, setPurchaseDate] = useState(null);
    const [maintenanceInterval, setMaintenanceInterval] = useState('');
    const [address, setAddress] = useState('');
    const [sku, setSku] = useState('');

    const { error, loading, cb: postDocument, data } = useAPI('POST', '/item');

    const handleSubmit = (e) => {
        e.preventDefault();
        postDocument({item_name: name, item_type: type, purchase_date: purchaseDate, sku: sku, address: address, company_id: 1, user_id: user.id, });
        setOpenAddItem(false);
    };
    
    //show a slect list to choose which company is the item from

    return (
        <form onSubmit={handleSubmit}>
        <Box sx={{display: 'flex', flexDirection: 'column', width: '80%', margin: '0 auto' }}>
            <FormControl fullWidth sx={{marginBottom: '15px'}}>
              <TextField
                label='Name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
            />
            </FormControl>
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px',  gap: '15px'}}>
                <TextField
                    label='Type'
                    type='text'
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    // fullWidth
                />  
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                    <DatePicker label='Purchase Date' 
                    value={purchaseDate}
                    onChange={(newValue) => setPurchaseDate(newValue)}/>
                </DemoContainer>
                </LocalizationProvider>
             </Box>
            <Box sx={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '15px'}}>
                <TextField
                  type='text'
                  label='Address'
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  fullWidth
                 />
                <TextField
                  type='text'
                  label='SKU'
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  fullWidth
                />
            </Box>
        </Box>
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Button type='submit' variant='contained' color='primary'>
                Create
            </Button>
        </Box>
        </form>
    );
};

export default CreateItem;