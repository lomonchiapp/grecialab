import React from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button } from '@mui/material';

export const NotificationPopUp = ({ open, notification, onClose }) => {
  if (!notification) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{notification.title}</DialogTitle>
      <DialogContent>
        <Typography>{notification.message}</Typography>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};
