import React, { useEffect, useState, useContext } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

import TicketingSystem from './TicketingSystem.js';
import { UserContext } from '../conetext/Context.js';
import Header from '../components/header.js';
import CreateButton from '../components/CreateButton';

const Start = () => {
    const { user, getUser, getUserCompanies, companies, getUserNotifications, notifications, currentCompany, getUserItems, setCurrentCompany,  userLoading } = useContext(UserContext);

    useEffect(() => {
        const getUserData = async() => {
            await getUser();
        };
        getUserData();
    }, []);
    
    useEffect(() => {
        const getCompanies = async() => {
            await getUserCompanies();
        };
        if(user?.id){getCompanies();};
    }, [user]);

    useEffect(() => {
        const getNotifications = async () => {
            await getUserNotifications();
            await getUserItems();
        };
        if(currentCompany?.company_id){getNotifications();}
    }, [currentCompany?.company_id]);

    // useEffect(() => {
    //     if(data){
    //         console.log(data);
    //         setUser(data.user);};
    // }, [data]);

    useEffect(() => {
        console.log(userLoading, user);
    }, [userLoading, user]);

    return (
        <>
        {/* {userLoading && <p>...userLoading</p>} */}
        {(!user && !userLoading) && (
        <Box sx={{
            maxWidth: '1300px',
            width: '100%',
            margin: '0 auto',
        }}>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'top',
                    justifyContent: 'space-between',
                    height: '60vh',
                    textAlign: 'center',
                    padding: '2rem',
                }}
            >
                <Box sx={{marginTop: '80px'}}>
                    {/* Title Section */}
                    <Typography variant='h3' sx={{ mb: 2, fontWeight: 'bold' }}>
                        Welcome to <span style={{ color: '#1665c0' }}>TechCheck</span>
                    </Typography>

                    {/* Button Section */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                        <Button variant='contained' color='primary' fullWidth>
                        <Link href='/login' style={{color: 'white'}}>LOG IN</Link>
                        </Button>
                        <Button variant='outlined' color='primary' fullWidth>
                        <Link href='/register'>CREATE AN ACCOUNT</Link>
                        </Button>
                    </Box>
                </Box>
                <Box sx={{
                    display: {
                    xs: 'none',
                    xl: 'block',
                    lg: 'block',
                    md: 'block',
                    },
                }}>
                    {/* Illustration */}
                    <img
                        src='https://img.freepik.com/free-vector/push-notifications-concept-illustration_114360-4986.jpg' // Replace with your illustration URL
                        alt='Notification Illustration'
                        style={{ width: '100%', marginBottom: '2rem' }}
                    />
                </Box>
            </Box>
            {/* Subheading */}
            <Typography
                variant='h1'
                sx={{
                fontWeight: 500,
                fontSize: { xs: '1.8rem', md: '128px' },
                }}
            >
                Automate your notifications with us
            </Typography>
        </Box>
       )}

        {(user && !userLoading) && (
           <Box sx={{height: '100vh'}}>
           <Header/>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'space-between',
                height: '90%',
                }}>
                <Box sx={{minWidth: '250px',maxWidth: '300px', width: '100%', borderRight: '1px solid #F0F0F0', padding: ' 10px 10px 10px 24px'}}>
                  <Typography variant='h6' sx={{color: '#1976d2'}}>Companies</Typography>
                  {companies?.companies?.length > 0 && companies.companies.map((companie) => {
                    return (<>
                    <Typography variant='body2' sx={{color: '#36373C', cursor: 'pointer'}} onClick={() => setCurrentCompany(companie)}>{companie.name}</Typography>
                    </>);
                  })}
                </Box>
                <Box sx={{padding: '10px', overflow: 'hidden', position: 'relative', height: '100%'}}>
                  <Typography variant='h6' sx={{color: '#1976d2'}}>{currentCompany?.name}</Typography>
                  <TicketingSystem notifications={notifications} currentCompany={currentCompany}/>
                  <CreateButton />
                </Box>
            </Box>
        </Box> 
        )}
       </>
    );
};

export default Start;
