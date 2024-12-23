import React, {useEffect, useState, useContext} from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';

import { useAPI } from '../custom-hooks/useAPI';

const CompanyContainer = () => {

    return (
        <>
            <Typography>Companies</Typography>
            {companies?.companies?.map((company) => {
            return(
                <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', gap: '15px'}}>
                    <TextField
                        label='Company name'
                        defaultValue={company?.name}
                        // fullWidth
                    />
                    <TextField
                        label='Company tin'
                        defaultValue={company?.tin}
                        // fullWidth
                    />
                    <Box display='flex' sx={{width: '40%',justifyContent: 'space-between', gap: '15px'}}>
                    <Button variant='outlined'>Edit</Button>
                    <Button variant='contained' color='error'>Delete</Button>
                    <Button variant='contained' onClick={() => setOpenAddPpl(true)}>
                        Add people
                    </Button>
                    </Box>
                </Box>
            );
            })}
            <Modal
                open={openAddPpl}
                onClose={() => setOpenAddPpl(false)}
                aria-labelledby='modal-modal-title'
                aria-describedby='modal-modal-description'
                slotProps={{
                    backdrop: {
                    sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    },
                    },
                }}
                >
                <Box sx={style}>
                    <Typography id='modal-modal-title' variant='h6' component='h2' sx={{marginBottom: '15px'}}>
                        Add new user to the company
                    </Typography>
                    <AddPeople company={currentCompany} />
                </Box>
            </Modal>
            </>
    )
};

export default CompanyContainer;