import React, {useState, useContext} from 'react';

import {
    Box,
    TextField,
    Typography,
    Button,
  } from '@mui/material';
  import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
  import { useAPI } from '../custom-hooks/useAPI';
  import { UserContext } from '../conetext/Context';

const EditCompany = ({company, setOpenEditCompany}) => {
    const { getUserCompany } = useContext(UserContext);

    const [companyName, setCompanyName] = useState(company.name);
    const [companyTin, setCompanyTin] = useState(company.tin);

    const removeEmail = useAPI('POST', `/company/${company.company_id}/remove-user`);
  
    const handleRemoveEmail = async (email) => {
      try {
        await removeEmail.cb({email});
        await getUserCompany();
        setOpenEditCompany(false);
      } catch(err){
        console.log(err);
      };
    };

    const handelEditCompany = async () => {
        try {
           await axios({
                method: 'PATCH',
                url: `/api/v1/company/${company.company_id}`,
                data: {name: companyName, tin: companyTin}
            });
            setOpenEditCompany(false);
        } catch(err){
            console.log(err);
        };
    };

    const handleDeleteCompany = async () => {
        try {
           await axios({
                method: 'DELETE',
                url: `/api/v1/company/${company.company_id}`,
            });
            setOpenEditCompany(false);
        } catch(err){
            console.log(err);
        };
    };

    return(
        <>
        <Box display='flex' gap={2} mb={3}>
          <TextField
            label='Company Name'
            defaultValue={company.name}
            fullWidth
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            label='Company Tin'
            fullWidth
            defaultValue={company.tin}
            value={companyTin}
            onChange={(e) => setCompanyTin(e.target.value)}
          />
        </Box>

        {company?.members?.map(email => {
            return (
            <Box
                key={email.id}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                borderBottom='1px solid #eee'
                py={1}
            >
                <Typography>{email.email}</Typography>
                <PersonRemoveIcon onClick={() => handleRemoveEmail(email.email)} />
            </Box>
            );
        })}

        <Box mt={4} display='flex' justifyContent='center' gap="15px">
          {company.role === 'admin' &&<Button variant='outlined' onClick={handelEditCompany}>EDIT</Button>}
          {company.role === 'admin' && <Button variant='contained' onClick={handleDeleteCompany} color='error'>Delete</Button>}
        </Box>
        </>
    );
};

export default EditCompany;
