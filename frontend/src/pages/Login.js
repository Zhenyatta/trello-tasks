import React, { useEffect, useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { useAPI } from '../custom-hooks/useAPI.js';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error, loading, cb: postDocument, data } = useAPI('POST', '/login');

    const handleSubmit = (e) => {
        e.preventDefault();
        postDocument({email, password});
    };

    useEffect(() => {
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
            <Typography variant='h3'>Log In</Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                    }}>
                    <Box>
                        <TextField
                            label='Email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='example@gmail.com'
                        />
                    </Box>
                    <Box>
                        <TextField
                            label='Password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
                    </Box>  
                
                <Button type='submit' variant='contained' color='primary' size='large' fullWidth>
                    Log in
                </Button>
                </Box>
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

export default Login;
