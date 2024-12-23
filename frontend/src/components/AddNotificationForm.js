import React, {useState, useContext} from 'react';
import { TextField, Button, FormControl } from '@mui/material';import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {Box, MenuItem} from '@mui/material';
import { UserContext } from '../conetext/Context';

import { useAPI } from '../custom-hooks/useAPI';
import { intervals } from '../constants/intervals';

const repetTypes = ['daily', 'weekly', 'monthly', 'yearly', 'singular'];

const AddNotificationForm = ({setOpenAddNotif}) => {
    const { items, getUserNotifications, currentCompany } = useContext(UserContext);
    console.log(items);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [link, setLink] = useState('');
    const [date, setDate] = useState(null);
    const [item, setItem] = useState(3);
    const [reciver, setReciver] = useState('');
    const [repeatType, setRepeatType] = useState('daily');

    const { error, loading, cb: postDocument, data } = useAPI('POST', '/notifications');
    const enhanceWithAiAPI = useAPI('POST', 'enhance-text');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await postDocument({notification_name: title, description: desc, video: link, notify_at: date, notify_who: ['jenya.paniryan8@gmail.com'], repeat_type: repeatType, item_id: item});
        await getUserNotifications();
        setOpenAddNotif(false);
    };

    const enhanceWithAi = async (text, setText) => {
        const data = await enhanceWithAiAPI.cb({text: text});
        setText(data.enhancedText);
    };

    return (
        <Box sx={{display: 'flex',}}>
        <Box sx={{width:'80%', borderRight: '1px solid #D9D9D9', paddingRight: '20px'}}>
            <form onSubmit={handleSubmit}>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <TextField
                        type='text'
                        name='Title'
                        label='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    /> 
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker 
                            label='Notification date' 
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                            disablePast/>
                        </DemoContainer>
                    </LocalizationProvider>
                </Box>
                <Button onClick={() => enhanceWithAi(title, setTitle)} sx={{marginBottom: '15px'}}>Enhance with AI ✨</Button>
                <FormControl fullWidth >
                    <TextField
                    type='text'
                    name='Description'
                    label='Description'
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    multiline
                    rows={4}
                />
                </FormControl>
                <Button onClick={() => enhanceWithAi(desc, setDesc)} sx={{marginBottom: '15px'}}>Enhance with AI ✨</Button>
                <FormControl fullWidth sx={{marginBottom: '15px'}} >
                <TextField
                    type='text'
                    name='Link'
                    value={link}
                    label='Link'
                    onChange={(e) => setLink(e.target.value)}
                />
                </FormControl>
                
                <Box sx={{display: 'flex', justifyContent: 'center'}}>
                    <Button type='submit' variant='contained' color='primary'>
                        Create
                    </Button>
                </Box>
            </form>
        </Box>
        {console.log(items)}
        <Box sx={{width: '200px', paddingLeft: '20px'}}>
            <TextField
                sx={{marginBottom: '15px'}}
                id='outlined-select-currency'
                select
                label='Item'
                helperText='Select the item'
                value={item}
                onChange={(e) => setItem(e.target.value)}
                fullWidth
                >
                {items?.companyItems?.map((option) => (
                    <MenuItem key={option.item_id} value={option.item_id}>
                        {option.item_name} {option.sku}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                sx={{marginBottom: '15px'}}
                id='outlined-select-currency'
                select
                label='Reciver'
                helperText='Select the reciver'
                value={reciver}
                onChange={(e) => setReciver(e.target.value)}
                fullWidth
                >
                {/* loop over company users, and show their emails */}
                {currentCompany?.members?.map((option) => (
                    <MenuItem key={option.id} value={option.email}>
                    {option.email}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                sx={{marginBottom: '15px'}}
                id='outlined-select-currency'
                select
                label='Repetitiveness'
                helperText='Select the repetitiveness'
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value)}
                fullWidth
                >
                {repetTypes?.map((option) => (
                    <MenuItem key={option} value={option}>
                    {option}
                    </MenuItem>
                ))}
            </TextField>
            {/* </FormControl> */}
        </Box>
    </Box>
    );
};

export default AddNotificationForm;
