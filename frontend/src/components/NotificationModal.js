import React, {useContext} from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useAPI } from '../custom-hooks/useAPI';
import { UserContext } from '../conetext/Context';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'row',
  gap: 4,
};

const leftSection = {
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const rightSection = {
  flex: 1,
  bgcolor: '#f5f5f5',
  p: 2,
  borderRadius: 2,
};

const NotificationModal = ({ 
  notification, 
  onClose,
  currentCompany
}) => {
  if (!notification) {return null;};
  const { getUserNotifications } = useContext(UserContext);

  const notificationEdit = useAPI('PATCH', `/notifications/${notification.id}`);
  const notificationDelete = useAPI('DELETE', `/notifications/${notification.id}`);

  const onComplete = async () => {
    await notificationEdit.cb({is_completed: notification.repeat_type === 'singular'});
    onClose();
  };

  const onEdit = async (fields) => {
    await notificationEdit.cb(fields);
    await getUserNotifications();
  };

  const onDelete = async () => {
    await notificationDelete.cb();
    await getUserNotifications();
    onClose();
  };

  const YouTubeEmbed = ({ videoUrl }) => {
    const getEmbedUrl = (url) => {
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^\s&]+)/);
      return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
    };
  
    const embedUrl = getEmbedUrl(videoUrl);
  
    return embedUrl ? (
      <iframe
        width="560"
        height="315"
        src={embedUrl}
        title="YouTube video"
        frameBorder="0"
        allowFullScreen
      />
    ) : (
      <p>Invalid video URL</p>
    );
  };

  return (
      <Box sx={style}>
        {/* Close button */}
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Left Section */}
        <Box sx={leftSection}>
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Typography id='notification-modal-title' variant='h6'>
              {notification.notification_name}
            </Typography>
            <Box
              sx={{
                backgroundColor: '#e0e0e0',
                borderRadius: 1,
                px: 1.5,
                py: 0.5,
                fontSize: '0.8rem',
              }}
            >
              {notification.notify_at}
            </Box>
          </Box>

          <Typography id='notification-modal-description' sx={{ color: 'text.secondary' }}>
            {notification.description}
          </Typography>

         { notification.video && <>
          <Typography sx={{ color: 'text.secondary' }}> Hint video </Typography>
         <YouTubeEmbed videoUrl={notification.video} />
         </>}

          <Box mt='auto' display='flex' gap={2} justifyContent='center'>
            <Button variant='contained' color='success' onClick={onComplete} disabled={notification?.is_completed}>
              {`Complete${ notification.repeat_type !== 'singular' ? ' and Reschedule' : ''}`}
            </Button>
            <Button variant='outlined' color='primary' onClick={onEdit}>
              Edit
            </Button>
            <Button variant='contained' color='error' onClick={onDelete}>
              Delete
            </Button>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={rightSection}>
          <Typography variant='body2'><strong>Company:</strong> {currentCompany?.name}</Typography>
          <Typography variant='body2'><strong>Item:</strong> Car charger TM002</Typography>
          <Typography variant='body2'><strong>Notification receiver:</strong> {notification?.notify_who?.[0]}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant='body2' fontWeight='bold'>
            Notification repetetivnes: 
          </Typography>
          {/* <List dense>
            {notification.times.map((time, idx) => (
              <ListItem key={idx} sx={{ pl: 0 }}> */}
                <Typography variant='body2'>{notification?.repeat_type}</Typography>
              {/* </ListItem>
            ))}
          </List> */}
        </Box>
      </Box>
  );
};

export default NotificationModal;
