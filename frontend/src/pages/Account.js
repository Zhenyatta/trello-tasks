import React, {useState, useContext, useEffect} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import LapTopIcon from '@mui/icons-material/Laptop';
import { Typography } from '@mui/material';
import {Button, Grid, TextField, Modal} from '@mui/material';

import { UserContext } from '../conetext/Context';
import { useAPI } from '../custom-hooks/useAPI';
import Header from '../components/header.js';
import AddPeople from '../components/AddPeople.js';
import CreateButton from '../components/CreateButton.js';
import UserContainer from '../components/UserContainer.js';
import EditCompany from '../components/EditCompany.js';
import EditItem from '../components/EditItem.js';

const style = {
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

const Account = () => {
    const { user, getUser, getUserCompanies, getUserItems, currentCompany, items, companies, setUser } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('companies');
    const [openAddPpl, setOpenAddPpl] = useState(false);
    const [openEditCompany, setOpenEditCompany] = useState(false);
    const [openEditItem, setOpenEditItem] = useState(false);

    useEffect(() => {
      getUser();
    }, []);

      useEffect(() => {
          const getCompanies = async() => {
              await getUserCompanies();
          };
          if(user?.id){getCompanies();};
      }, [user]);
  
      useEffect(() => {
          const getNotifications = async () => {
              await getUserItems();
          };
          if(currentCompany?.company_id){getNotifications();}
      }, [currentCompany?.company_id]);

      const handelDeleteItem = async (id) => {
         await axios({
            method: 'DELETE',
            url: `/api/v1/item/${id}`,
        });
        getUserItems();
      };

  return (
      <>
        <Header />
        <Box sx={{padding: '10px 10px 10px 24px'}}>
          <Box>
              <Typography variant='h5' gutterBottom>
                Settings
              </Typography>
              <Divider />
              <Grid container spacing={4} sx={{marginTop: '5px'}}>
              <Grid item xs={12} md={3}>
                <List>
                  <ListItem disablePadding onClick={() => setActiveTab('companies')}>
                    <ListItemButton selected={activeTab === 'companies'}>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText primary='Companies' />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={() => setActiveTab('items')}>
                    <ListItemButton selected={activeTab === 'items'}>
                      <ListItemIcon>
                        <LapTopIcon />
                      </ListItemIcon>
                      <ListItemText primary='Items' />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding onClick={() => setActiveTab('personalInfo')}>
                    <ListItemButton selected={activeTab === 'personalInfo'}>
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
                      <ListItemText primary='Personal Information' />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  {activeTab === 'companies' && user && (
                      <>
                      <Typography>Companies</Typography>
                      {companies?.companies?.map((company) => {
                        return(
                          <Grid container spacing={2} sx={{marginTop: '15px'}}>
                          <Grid item xs={12} sm={6} md={3}>
                          <TextField
                              label='Company name'
                              defaultValue={company?.name}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                          <TextField
                              label='Company tin'
                              defaultValue={company?.tin}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={3}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button variant='outlined' onClick={() => setOpenEditCompany(true)}>Edit</Button>
                              <Button variant='contained' onClick={() => setOpenAddPpl(true)}>Add People</Button>
                            </Box>   
                          </Grid>
                          </Grid>
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
                                <AddPeople company={currentCompany} closeModal={setOpenAddPpl} />
                            </Box>
                        </Modal>
                        <Modal
                            open={openEditCompany}
                            onClose={() => setOpenEditCompany(false)}
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
                                    Edit Company
                                </Typography>
                                <EditCompany company={currentCompany} setOpenEditCompany={setOpenEditCompany} />
                            </Box>
                        </Modal>
                      </>
                  )}
                  {activeTab === 'items' && (
                      <>
                      <Typography>Items</Typography>
                      <Typography>Company: {currentCompany?.name}</Typography>
                      {items?.companyItems?.map((item) => {
                        return(
                          <Grid container spacing={2} sx={{marginTop: '15px'}}>
                          <Grid item xs={12} sm={6} md={3}>
                          <TextField
                              label='Item name'
                              defaultValue={item?.item_name}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                          <TextField
                              label='Item sku'
                              defaultValue={item?.sku}
                              fullWidth
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Button variant='outlined' sx={{marginRight: '5px'}} onClick={() => setOpenEditItem(true)}>Edit</Button>
                            {user.role !== 'user' && <Button variant='contained' color='error' onClick={()=> handelDeleteItem(item.item_id)}>Delete</Button>}
                            <Modal
                            open={openEditItem}
                            onClose={() => setOpenEditItem(false)}
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
                                    Edit Item
                                </Typography>
                                <EditItem user={user} item={item} setOpenAddItem={openEditItem} />
                            </Box>
                        </Modal>
                          </Grid>
                          </Grid>
                        );
                      })}
                      </>
                  )}
                  {activeTab === 'personalInfo' && (
                    <UserContainer />
                  )}
              </Box>
              </Grid>
              </Grid>
          </Box>
          <CreateButton />
        </Box>
      </>
  );
};

export default Account;
