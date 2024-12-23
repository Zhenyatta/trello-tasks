import React, {useContext, useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link } from '@mui/material';

import { UserContext } from '../conetext/Context.js';

const Header = () => {
  // const { user, getUser, getUserCompanies, companies, getUserNotifications, notifications, currentCompany, getUserItems, setCurrentCompany, loading } = useContext(UserContext);

  const [auth, setAuth] = useState(true);

  return (
    <Box sx={{ flexGrow: 1, zIndex: 10 }}>
      <AppBar position='static'>
        <Toolbar sx={{ backgroundColor: '#fff' }}>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1, color: '#1976d2' }} >
                <Link href='/' sx={{textDecoration: 'none'}}>
                  TechCheck
                </Link>
            </Typography>
          {auth && (
            <div>
                <Link href='/account'>
                 <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
                </Link>
             
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
