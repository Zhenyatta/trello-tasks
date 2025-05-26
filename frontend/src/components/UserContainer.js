import React, {useEffect, useState, useContext} from 'react';
import { Box, Button, TextField, Typography, Grid } from '@mui/material';

import { useAPI } from '../custom-hooks/useAPI';
import { UserContext } from '../conetext/Context';

const UserContainer = () => {
    const { user, getUser, setUser } = useContext(UserContext);

    const [phone, setPhone] = useState(user?.phoneNumber);
    const [name, setName] = useState(user?.name);
    const [lastName, setLastName] = useState(user?.lastname);
    const [email, setEmail] = useState(user?.email);
    
    const logOutReq = useAPI('POST', '/logout');
    const editUser = useAPI('PATCH', '/user');

    const handelEdit = async () => {
        try {
            await editUser.cb({
                id: user?.id, phoneNumber: phone, name: name, lastname: lastName, email: email
            });
            await getUser();
        } catch(err) {
            console.log(err);
        }
    };

    const handelLogout = async () => {
        try {
            await logOutReq.cb();
            setUser(null);
            window.location.replace('http://localhost:8080/');
        } catch(err){
            console.log(err);
        }
    };

    return (
        <>
        <Typography>Personal Information</Typography>
      <Grid container spacing={2} sx={{marginTop: '15px'}}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label='Phone number'
            defaultValue={user?.phoneNumber}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label='First name'
            defaultValue={user?.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label='Last Name'
            defaultValue={user?.lastname}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label='Email address'
            defaultValue={user?.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Box mt={2} display='flex' gap={2} sx={{justifyContent: 'center'}}>
            <Button variant='outlined' onClick={handelEdit}>Edit</Button>
            <Button variant='contained' color='error'>Delete Account</Button>
            <Button onClick={handelLogout}> Logout</Button>
          </Box>
        </Grid>
      </Grid>
      </> 
    );
};

export default UserContainer;
