import React, {useState} from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

export const NewDialog = ({children, setOpen, open}) => {
    
    const handleClose = () => {
        setOpen(false)
    } 
  return (
    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
>
        <DialogContent>
            {children}
        </DialogContent>
    </Dialog>
  )
}
