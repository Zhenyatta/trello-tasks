import React, {useState, useContext} from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Box} from '@mui/material';
import axios from 'axios';

import { UserContext } from '../conetext/Context';

// item_name,
//       item_type,
//       purchase_date,
//       maintenance_interval,
//       company_id,
//       user_id,

const EditItem = ({user, setOpenAddItem, item}) => {
    const { getUserItems } = useContext(UserContext);

    const [name, setName] = useState(item.item_name);
    const [type, setType] = useState(item.item_type);
    const [purchaseDate, setPurchaseDate] = useState(null);
    const [address, setAddress] = useState(item.address);
    const [sku, setSku] = useState(item.sku);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios({
            method: 'PATCH',
            url: `/api/v1/item/${item.item_id}`,
            data: {item_name: name, item_type: type, purchase_date: purchaseDate, sku: sku, address: address, company_id: 1, user_id: user.id, }
        });
        getUserItems();
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
                Edit
            </Button>
        </Box>
        </form>
    );
};

export default EditItem;