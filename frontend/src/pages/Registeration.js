import React, { useState, useEffect } from 'react';

import { useAPI } from '../custom-hooks/useAPI.js';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Registration = () => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const { error, loading, cb: postDocument, data } = useAPI('POST', '/register');

    const handleSubmit = (e) => {
        e.preventDefault();
        postDocument({name, lastname, email, phoneNumber: phone, password});
    };

    useEffect(() => {
        console.log(data);
        if(data?.code === 200) {
            window.location.replace('http://localhost:8080/');
        };
    }, [data]);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            textAlign: 'center',
            flexDirection: 'column',
            gap: '20px',
        }}>
        <Typography variant='h3'>Registration</Typography>
        <form onSubmit={handleSubmit}>
            <Box
            sx={{display: 'flex',
                gap: '20px',
                marginBottom: '20px'}}>
                <TextField
                label='First Name'
                type='name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
             <TextField
                label='Last Name'
                type='lastname'
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
            />
            </Box>
            <Box sx={{display: 'flex',
                gap: '20px',
                marginBottom: '20px'}}>
                 <TextField
                label='Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
             <TextField
                label='Phone'
                type='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            </Box>
            <Box sx={{display: 'flex',
                gap: '20px',
                marginBottom: '20px'}}>
               <TextField
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                /> 
                <TextField
                label='Repeat Password'
                type='password'
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                error={password !== repeatPassword}
                helperText={password !== repeatPassword ? 'incorrect password' : ''}
                /> 
            </Box>
            
            <Button type='submit' variant='contained' color='primary' size='large' fullWidth>
                Register
            </Button>
            {loading && <CircularProgress />}
            {error && (
                <Typography variant='subtitle1' color='error'>
                    Error: {error}
                </Typography>
            )}
        </form>
        </Box>
    );
};

export default Registration;
