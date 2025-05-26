import React, {useState, useContext} from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { Modal, Typography } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LaptopIcon from '@mui/icons-material/Laptop';

import AddNotificationForm from '../components/AddNotificationForm';
import CreateItem from '../pages/CreateItem.js';
import { UserContext } from '../conetext/Context.js';
import CreateCompany from '../pages/CreateCompany.js';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '1280px', //here
    bgcolor: '#fff',
    boxShadow: 'var(--ds-shadow-overlay, 0 8px 9pt #091e4226, 0 0 1px #091e424f)',
    p: 4,
    borderRadius: '5px',
  };

  const style2 = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px', //here
    bgcolor: '#fff',
    boxShadow: 'var(--ds-shadow-overlay, 0 8px 9pt #091e4226, 0 0 1px #091e424f)',
    p: 4,
    borderRadius: '5px',
  };

const CreateButton = () => {
  const [openAddNotif, setOpenAddNotif] = useState(false);
  const [openAddItem, setOpenAddItem] = useState(false);
  const [openAddCompany, setOpenAddCompany] = useState(false);

  const { user } = useContext(UserContext);

  const actions = [
        { icon: <NotificationsActiveIcon />, name: 'Notification', onClick: () => {setOpenAddNotif(true);} },
        { icon: <LaptopIcon />, name: 'Item', onClick: () => {setOpenAddItem(true);} },
        { icon: <WorkIcon />, name: 'Company', onClick: () => {setOpenAddCompany(true);} },
];

  return (
    <>
      <SpeedDial
        ariaLabel='SpeedDial basic example'
        sx={{ position: 'absolute', bottom: '10px', left: '50%' }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    <Modal
        open={openAddNotif}
        onClose={() => setOpenAddNotif(false)}
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
                Add Notification
            </Typography>
            <AddNotificationForm setOpenAddNotif={setOpenAddNotif} />
        </Box>
    </Modal>
    <Modal
        open={openAddItem}
        onClose={() => setOpenAddItem(false)}
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
        <Box sx={style2}>
            <Typography id='modal-modal-title' variant='h6' component='h2' sx={{textAlign: 'center'}}>
                Add Item
            </Typography>
            <CreateItem user={user} setOpenAddItem={setOpenAddItem}/>
        </Box>
    </Modal>

    <Modal
        open={openAddCompany}
        onClose={() => setOpenAddCompany(false)}
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
        <Box sx={style2}>
            <Typography id='modal-modal-title' variant='h6' component='h2' sx={{textAlign: 'center'}}>
                Add Company
            </Typography>
            <CreateCompany user={user?.id} setOpenAddCompany={setOpenAddCompany} />
        </Box>
    </Modal>
    </>
  );
};

export default CreateButton;
